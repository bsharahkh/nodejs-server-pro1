const fs = require("fs");
const path = require("path");
const pool = require("../src/db"); // your pg pool

(async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // keep track of applied migrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        run_on TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, "../migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"));

    for (const file of files) {
      const applied = await client.query(
        "SELECT 1 FROM migrations WHERE name = $1",
        [file]
      );

      if (applied.rowCount === 0) {
        // const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

        const sql = fs
          .readFileSync(path.join(migrationsDir, file), "utf-8")
          .replace(/^\uFEFF/, ""); // strip BOM if exists

        console.log(`Running migration: ${file}`);
        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      }
    }

    await client.query("COMMIT");
    console.log("✅ All migrations applied");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
