import {Pool} from "pg";
import {PostgresAdapter, Table} from "./src";
import {integer, text, timestamp, uuid, varchar,} from "./src/types/column-type";

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
  const userTable = new Table<any>("users");
  userTable.column("id", uuid()).primaryKey().$defaultUUID();
  userTable.column("name", varchar()).notNull();
  userTable.column("email", varchar()).notNull();
  userTable.column("age", integer());
  userTable.column("bio", text());
  userTable.column("created_at", timestamp()).$defaultNOW();

  const postTable = new Table<any>("posts");
  postTable.column("id", uuid()).primaryKey().$defaultUUID();
  postTable.column("title", varchar()).notNull();
  postTable.column("content", text());
  postTable.column("author_id", uuid()).notNull().references({
    table: "users",
    column: "id",
    onDelete: "CASCADE",
  });

  const tagTable = new Table<any>("tags");
  tagTable.column("id", uuid()).primaryKey().$defaultUUID();
  tagTable.column("title", varchar()).notNull();

  const articleTagPivotTable = new Table<any>("post_tag_pivot");
  articleTagPivotTable.column("post_id", uuid()).notNull().references({
    table: "posts",
    column: "id",
    onDelete: "CASCADE",
  });
  articleTagPivotTable.column("tag_id", uuid()).notNull().references({
    table: "tags",
    column: "id",
    onDelete: "CASCADE",
  });
  await cleanupTestTables()

  const createUserTableSQL = userTable.createTableSql()
  const createPostsTableSql = postTable.createTableSql()
  const createTagsTableSql = tagTable.createTableSql()
  const createPostTagPivotTableSql = articleTagPivotTable.createTableSql()

  await pool.query(createUserTableSQL);
  await pool.query(createPostsTableSql);
  await pool.query(createTagsTableSql);
  await pool.query(createPostTagPivotTableSql);
}

// Clean up test tables
export async function cleanupTestTables() {
  await pool.query(`
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS posts CASCADE;
    DROP TABLE IF EXISTS tags CASCADE;
    DROP TABLE IF EXISTS post_tag_pivot CASCADE;
  `);
}

// Clean up test data
export async function cleanupTestData() {
  await pool.query(`
    TRUNCATE TABLE users CASCADE;
    TRUNCATE TABLE posts CASCADE;
    TRUNCATE TABLE tags CASCADE;
    TRUNCATE TABLE post_tag_pivot CASCADE;
  `);
}

// domain models

export interface DomainUser {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  created_at: Date;
}

export interface DomainPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author?: DomainUser;
}
