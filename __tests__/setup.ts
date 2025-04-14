import { Pool } from "pg";
import { PostgresAdapter } from "../src/dialects/postgres";

// Test database configuration
const TEST_DB_CONFIG = {
  host: process.env.TEST_DB_HOST || "localhost",
  port: parseInt(process.env.TEST_DB_PORT || "5432"),
  database: process.env.TEST_DB_NAME || "tinyorm_test",
  user: process.env.TEST_DB_USER || "rayhan",
  password: process.env.TEST_DB_PASSWORD || "rayhan123",
};

// Create a test database connection pool
export const pool = new Pool(TEST_DB_CONFIG);

// Create a real executor for testing
export const executor = new PostgresAdapter(pool);

// Create test tables
export async function setupTestTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      age INTEGER
    );
  `);
}

// Clean up test tables
export async function cleanupTestTables() {
  await pool.query(`
    DROP TABLE IF EXISTS users CASCADE;
  `);
}

// Clean up test data
export async function cleanupTestData() {
  await pool.query(`
    TRUNCATE TABLE users CASCADE;
  `);
}

// Close database connection
export async function closeConnection() {
  await pool.end();
}
