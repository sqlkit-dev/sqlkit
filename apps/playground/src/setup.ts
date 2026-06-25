import { Pool } from "pg";
import { PostgresAdapter } from "sqlkit";

const config = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "tinyorm_test",
  user: process.env.DB_USER || "rayhan",
  password: process.env.DB_PASSWORD || "rayhan123"
};

export const pool = new Pool(config);
export const executor = new PostgresAdapter(pool);

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  created_at?: Date;
}

export async function setupTables() {
  await executor.executeSQL("DROP TABLE IF EXISTS users CASCADE", []);
  await executor.executeSQL(
    `
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      age INTEGER,
      bio TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `,
    []
  );
}

export async function seedUsers() {
  const samples = [
    { name: "Alice", email: "alice@example.com", age: 28 },
    { name: "Bob", email: "bob@example.com", age: 34 },
    { name: "Carol", email: "carol@example.com", age: 22 }
  ];

  for (const user of samples) {
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
      [user.name, user.email, user.age]
    );
  }
}
