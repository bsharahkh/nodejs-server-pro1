const pool = require("../../db");

exports.createTier = async ({
  name,
  description,
  price = 0,
  duration_days = 30,
  active = true,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO tiers (name, description, price, duration_days, active)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, description, price, duration_days, active]
  );
  return rows[0];
};

exports.updateTier = async (id, data) => {
  const { name, description, price, duration_days, active } = data;
  const { rows } = await pool.query(
    `UPDATE tiers SET name=COALESCE($1,name), description=COALESCE($2,description), price=COALESCE($3,price), duration_days=COALESCE($4,duration_days), active=COALESCE($5,active)
     WHERE id=$6 RETURNING *`,
    [name, description, price, duration_days, active, id]
  );
  return rows[0];
};

exports.deleteTier = async (id) => {
  await pool.query("DELETE FROM tiers WHERE id=$1", [id]);
};

exports.listTiers = async ({ name, order, limit, offset }) => {
  const where = [];
  const values = [];
  let i = 1;
  if (name) {
    where.push(`t.name ILIKE $${i++}`);
    values.push(`%${name}%`);
  }
  const wc = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    WITH ft AS (
      SELECT t.* FROM tiers t ${wc}
    ),
    aj AS (
      SELECT 
        t.id,
        t.name,
        t.description,
        t.price,
        t.duration_days,
        t.active,
        t.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'book_id', tba.book_id,
              'book_details_id', tba.book_details_id,
              'unlock_delay_minutes', tba.unlock_delay_minutes,
              'required', tba.required
            ) ORDER BY tba.book_id
          ) FILTER (WHERE tba.id IS NOT NULL),
          '[]'
        ) AS access
      FROM ft t
      LEFT JOIN tier_book_access tba ON t.id=tba.tier_id
      GROUP BY 
        t.id, t.name, t.description, t.price, t.duration_days, t.active, t.created_at
    ),
    c AS (SELECT COUNT(*)::int AS total FROM ft)
    SELECT a.*, c.total FROM aj a, c
    ORDER BY a.name ${order === "desc" ? "DESC" : "ASC"}
    LIMIT $${i++} OFFSET $${i}
  `;
  values.push(limit, offset);
  const { rows } = await pool.query(sql, values);
  const totalItems = rows[0]?.total || 0;
  const items = rows.map(({ total, ...r }) => r);
  return { totalItems, items };
};

exports.upsertTierAccess = async ({
  tier_id,
  book_id,
  book_details_id = null,
  unlock_delay_minutes = 0,
  required = false,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO tier_book_access (tier_id, book_id, book_details_id, unlock_delay_minutes, required)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (tier_id, book_id, book_details_id)
     DO UPDATE SET unlock_delay_minutes=EXCLUDED.unlock_delay_minutes, required=EXCLUDED.required
     RETURNING *`,
    [tier_id, book_id, book_details_id, unlock_delay_minutes, required]
  );
  return rows[0];
};

exports.getUserSubscriptionsAdmin = async ({
  email,
  tier,
  user_id,
  limit,
  offset,
  order,
}) => {
  const where = [];
  const values = [];
  let i = 1;
  if (email) {
    where.push(`u.email ILIKE $${i++}`);
    values.push(`%${email}%`);
  }
  if (tier) {
    where.push(`t.name ILIKE $${i++}`);
    values.push(`%${tier}%`);
  }
  if (user_id) {
    where.push(`u.id=$${i++}`);
    values.push(user_id);
  }
  const wc = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    WITH f AS (
      SELECT us.*, u.email, t.name AS tier_name
      FROM user_subscriptions us
      JOIN users u ON us.user_id=u.id
      JOIN tiers t ON us.tier_id=t.id
      ${wc}
    ), c AS (SELECT COUNT(*)::int AS total FROM f)
    SELECT f.*, c.total FROM f, c
    ORDER BY f.created_at ${order === "asc" ? "ASC" : "DESC"}
    LIMIT $${i++} OFFSET $${i}
  `;
  values.push(limit, offset);
  const { rows } = await pool.query(sql, values);
  const totalItems = rows[0]?.total || 0;
  const items = rows.map(({ total, ...r }) => r);
  return { totalItems, items };
};

exports.getAccessLogsAdmin = async ({
  email,
  book,
  user_id,
  limit,
  offset,
  order,
}) => {
  const where = [];
  const values = [];
  let i = 1;
  if (email) {
    where.push(`u.email ILIKE $${i++}`);
    values.push(`%${email}%`);
  }
  if (book) {
    where.push(`bd.name ILIKE $${i++}`);
    values.push(`%${book}%`);
  }
  if (user_id) {
    where.push(`u.id=$${i++}`);
    values.push(user_id);
  }
  const wc = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    WITH f AS (
      SELECT u.email, bd.name AS book_detail, l.created_at
      FROM user_book_access_log l
      JOIN users u ON l.user_id=u.id
      JOIN books_details bd ON l.book_detail_id=bd.id
      ${wc}
    ), c AS (SELECT COUNT(*)::int AS total FROM f)
    SELECT f.*, c.total FROM f, c
    ORDER BY f.created_at ${order === "asc" ? "ASC" : "DESC"}
    LIMIT $${i++} OFFSET $${i}
  `;
  values.push(limit, offset);
  const { rows } = await pool.query(sql, values);
  const totalItems = rows[0]?.total || 0;
  const items = rows.map(({ total, ...r }) => r);
  return { totalItems, items };
};
