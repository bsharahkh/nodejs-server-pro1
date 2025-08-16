const pool = require("../../db");

exports.createUser = async ({ email, passwordHash, verifyCode }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO users (email, password, verified, verify_code)
       VALUES ($1, $2, FALSE, $3) RETURNING id, email`,
      [email, passwordHash, verifyCode]
    );
    const userId = rows[0].id;
    await client.query(
      `INSERT INTO user_roles (user_id, role) VALUES ($1, 'user')`,
      [userId]
    );
    await client.query("COMMIT");
    return { id: userId, email };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

exports.findUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  return rows[0];
};

exports.setVerifyCode = async (email, code) => {
  await pool.query("UPDATE users SET verify_code=$1 WHERE email=$2", [
    code,
    email,
  ]);
};

exports.verifyEmail = async (email) => {
  await pool.query(
    "UPDATE users SET verified=TRUE, verify_code=NULL WHERE email=$1",
    [email]
  );
};

exports.setResetCode = async (email, code) => {
  await pool.query("UPDATE users SET reset_code=$1 WHERE email=$2", [
    code,
    email,
  ]);
};

exports.updatePasswordByEmail = async (email, hash) => {
  await pool.query(
    "UPDATE users SET password=$1, reset_code=NULL WHERE email=$2",
    [hash, email]
  );
};

exports.getUserRoles = async (userId) => {
  const { rows } = await pool.query(
    "SELECT role FROM user_roles WHERE user_id=$1",
    [userId]
  );
  return rows.map((r) => r.role);
};

exports.ensureUserWithGoogle = async (email) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const u = await client.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    let userId;
    if (!u.rows.length) {
      const ins = await client.query(
        "INSERT INTO users (email, verified) VALUES ($1, TRUE) RETURNING id",
        [email]
      );
      userId = ins.rows[0].id;
      await client.query(
        `INSERT INTO user_roles (user_id, role) VALUES ($1, 'user')`,
        [userId]
      );
    } else {
      userId = u.rows[0].id;
    }
    await client.query("COMMIT");
    return userId;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};
