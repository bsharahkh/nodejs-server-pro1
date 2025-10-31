const pool = require("../../db");


exports.listBooks = async ({
  name,
  isAdmin,
  limit,
  offset,
  order,
}) => {

  const sql = `WITH fb AS (
       SELECT b.*
       FROM books b
       WHERE  
          b.active=TRUE
        ${name ? " AND b.name ILIKE $3 ":""}
     ), c AS (SELECT COUNT(*)::int AS total FROM fb)
     SELECT b.*, c.total FROM fb b, c
     ORDER BY b.name ${order === "desc" ? "DESC" : "ASC"}
     LIMIT $1 OFFSET $2`;

    //  console.log(sql);
     const params = [
    limit,
    offset,
  ];
    
  if (name) {
    params.push(`%${name}%`);
  }


  const { rows } = await pool.query(sql,params);
  const totalItems = rows[0]?.total || 0;
  return { totalItems, items: rows.map(({ total, ...r }) => r) };
};



exports.getUserTierIdsActive = async ({ userId, isAdmin }) => {
  const { rows } = await pool.query(
    `SELECT tier_id FROM user_subscriptions WHERE user_id=$1 ${
      isAdmin ? "" : "AND active=TRUE"
    } AND NOW() BETWEEN start_date AND end_date`,
    [userId]
  );
  return rows.map((r) => r.tier_id);
};

exports.listAvailableBooks = async ({
  tierIds,
  name,
  isAdmin,
  limit,
  offset,
  order,
}) => {
  if (!tierIds.length) return { totalItems: 0, items: [] };

  const sql = `WITH fb AS (
       SELECT DISTINCT b.*
       FROM books b
       JOIN tier_book_access tba ON b.id=tba.book_id
       WHERE tba.tier_id = ANY($1)
         ${isAdmin ? "" : "AND b.active=TRUE"}
         AND b.name ILIKE $2
     ), c AS (SELECT COUNT(*)::int AS total FROM fb)
     SELECT b.*, c.total FROM fb b, c
     ORDER BY b.name ${order === "desc" ? "DESC" : "ASC"}
     LIMIT $3 OFFSET $4`;

    //  console.log(sql);

  const { rows } = await pool.query(sql, [
    tierIds,
    `%${name || ""}%`,
    limit,
    offset,
  ]);
  const totalItems = rows[0]?.total || 0;
  return { totalItems, items: rows.map(({ total, ...r }) => r) };
};
