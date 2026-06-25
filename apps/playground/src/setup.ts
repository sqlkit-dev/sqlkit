import { Pool } from "pg";
import { PostgresAdapter } from "sqlkit";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
export const executor = new PostgresAdapter(pool);
