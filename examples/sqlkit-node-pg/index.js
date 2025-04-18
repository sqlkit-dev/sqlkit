const sqlkit = require("sqlkit");
const pg = require("pg");

async function main() {
  const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: "rayhan",
    password: "rayhan123",
    database: "tinyorm_test",
  });
  const executor = new sqlkit.PostgresAdapter(pool);

  const repo = new sqlkit.Repository("users", executor);

  console.log(
    await repo.findRows({
      limit: 10,
    })
  );
}
main();
