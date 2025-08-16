const { Pool } = require("pg");
const { DB } = require("../config");

const pool = new Pool(DB);

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Unexpected PG error", err);
  process.exit(-1);
});

module.exports = pool;
