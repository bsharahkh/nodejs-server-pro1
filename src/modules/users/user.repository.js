const pool = require("../../db");

exports.getProfile = async (userId) => {
  const { rows } = await pool.query(
    "SELECT id, email, verified, created_at FROM users WHERE id=$1",
    [userId]
  );
  return rows[0];
};

exports.getMySubscriptions = async (userId) => {
  const { rows } = await pool.query(
    `SELECT us.*, t.name AS tier_name
     FROM user_subscriptions us JOIN tiers t ON us.tier_id = t.id
     WHERE us.user_id=$1 ORDER BY us.created_at DESC`,
    [userId]
  );
  return rows;
};

exports.getMyAccessLog = async (userId) => {
  const { rows } = await pool.query(
    `SELECT bd.name, l.created_at
     FROM user_book_access_log l
     JOIN books_details bd ON l.book_detail_id = bd.id
     WHERE l.user_id=$1 ORDER BY l.created_at DESC`,
    [userId]
  );
  return rows;
};

exports.createSubscription = async ({ userId, tierId, startDate, endDate }) => {
  await pool.query(
    `INSERT INTO user_subscriptions (user_id, tier_id, start_date, end_date, active)
     VALUES ($1, $2, $3, $4, TRUE)`,
    [userId, tierId, startDate, endDate]
  );
};

exports.readTier = async (tierId, onlyActive) => {
  const { rows } = await pool.query(
    `SELECT * FROM tiers WHERE id=$1 ${onlyActive ? "AND active=TRUE" : ""}`,
    [tierId]
  );
  return rows[0];
};
