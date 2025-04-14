import tinyorm from "../dist/index.cjs";

function main() {
  const db = tinyorm.createDatabase("postgres", {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });
}
