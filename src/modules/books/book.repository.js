const pool = require("../../db");

exports.listBooks = async ({ active, name, order, limit, offset }) => {
  const where = [];
  const values = [];
  let i = 1;
  if (typeof active === "boolean") {
    where.push(`active = $${i++}`);
    values.push(active);
  }
  if (name) {
    where.push(`name ILIKE $${i++}`);
    values.push(`%${name}%`);
  }
  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    WITH fb AS (SELECT * FROM books ${whereClause}),
    c AS (SELECT COUNT(*)::int AS total FROM fb)
    SELECT b.*, c.total FROM fb b, c
    ORDER BY b.name ${order === "desc" ? "DESC" : "ASC"}
    LIMIT $${i++} OFFSET $${i}
  `;
  values.push(limit, offset);

  // console.log(sql);
  
  const { rows } = await pool.query(sql, values);
  const totalItems = rows[0]?.total || 0;
  return { totalItems, items: rows.map(({ total, ...r }) => r) };
};

exports.createBook = async ({ name, description, active = true }) => {
  const { rows } = await pool.query(
    `INSERT INTO books (name, description, active) VALUES ($1, $2, $3) RETURNING *`,
    [name, description, active]
  );
  return rows[0];
};

exports.updateBook = async (id, { name, description, active }) => {
  const { rows } = await pool.query(
    `UPDATE books SET name=COALESCE($1,name), description=COALESCE($2,description), active=COALESCE($3,active)
     WHERE id=$4 RETURNING *`,
    [name, description, active, id]
  );
  return rows[0];
};

exports.deleteBook = async (id) => {
  await pool.query("DELETE FROM books WHERE id=$1", [id]);
};

exports.listBookDetails = async ({ bookId, onlyActive }) => {
  const { rows } = await pool.query(
    `SELECT * FROM books_details WHERE book_id=$1 ${
      onlyActive ? "AND active=TRUE" : ""
    } ORDER BY name ASC`,
    [bookId]
  );
  return rows;
};

exports.getBookDetail = async (id, onlyActive) => {
  const { rows } = await pool.query(
    `SELECT * FROM books_details WHERE id=$1 ${
      onlyActive ? "AND active=TRUE" : ""
    }`,
    [id]
  );
  return rows[0];
};

exports.createBookDetail = async ({
  book_id,
  name,
  description,
  book_data,
  active = true,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO books_details (book_id,name,description,book_data,active) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [book_id, name, description, book_data, active]
  );
  return rows[0];
};

exports.updateBookDetail = async (
  id,
  { name, description, book_data, active }
) => {
  const { rows } = await pool.query(
    `UPDATE books_details SET 
    name=COALESCE($1,name), 
    description=COALESCE($2,description), 
    book_data=COALESCE($3,book_data), 
    active=COALESCE($4,active)
     WHERE id=$1 RETURNING *`,
    [name, description, book_data, active, id]
  );
  return rows[0];
};

exports.deleteBookDetail = async (id) => {
  await pool.query("DELETE FROM books_details WHERE id=$1", [id]);
};

exports.insertAccessLog = async ({ userId, bookDetailId }) => {
  await pool.query(
    "INSERT INTO user_book_access_log (user_id, book_detail_id) VALUES ($1,$2)",
    [userId, bookDetailId]
  );
};

exports.getUnlockRows = async ({ userId, bookDetailId, isAdmin }) => {
  const { rows } = await pool.query(
    `SELECT tba.unlock_delay_minutes, us.start_date
     FROM tier_book_access tba
     JOIN user_subscriptions us ON tba.tier_id = us.tier_id
     WHERE us.user_id=$1 AND tba.book_details_id=$2
       ${
         isAdmin ? "" : "AND us.active=TRUE"
       } AND NOW() BETWEEN us.start_date AND us.end_date`,
    [userId, bookDetailId]
  );
  return rows;
};
