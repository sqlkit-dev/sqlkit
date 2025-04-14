import { Client } from "pg";
import { PostgresAdapter } from "../src/dialects/postgres";
import { InsertQueryBuilder } from "../src/query-builder";

type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

export const client = new Client({
  host: "localhost",
  user: "rayhan",
  password: "rayhan123",
  database: "tinyorm",
  port: 5432,
});
export const pgClient = new PostgresAdapter(client);

beforeAll(async () => {
  console.log("-- Testing database migration --");
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      age INT
    );
  `);
});

describe("TinyORM Select/Insert", () => {
  it("should insert a user", async () => {
    const result = await new InsertQueryBuilder<User>("users", pgClient)
      .values([
        {
          name: "Rayhan",
          email: "rayhan1@test.com",
          age: 25,
        },
        {
          name: "Rayhan2",
          email: "rayhan2@test.com",
          age: 25,
        },
      ])
      .returning(["id", "name"])
      .execute();

    console.log(JSON.stringify(result, null, 2));
  });
});

afterAll(async () => {
  // await client.query("DROP TABLE IF EXISTS users;");
  await client.end();
});
