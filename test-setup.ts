import { Pool } from "pg";
import { PostgresAdapter, Table } from "./src";
import {
  integer,
  text,
  timestamp,
  uuid,
  varchar,
} from "./src/types/column-type";
import { faker } from "@faker-js/faker";

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
  await cleanupTestTables();

  const createUserTableSQL = userTable.createTableSql();
  const createPostsTableSql = postTable.createTableSql();
  const createTagsTableSql = tagTable.createTableSql();
  const createPostTagPivotTableSql = articleTagPivotTable.createTableSql();

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

// Seed test data: Creates 5 users, each with 5-10 posts, and assigns tags to posts through a pivot table.
export async function seedTestData() {
  // Seed users
  const userInsertPromises = Array.from({ length: 5 }).map(() => {
    return pool.query(
      `INSERT INTO users (name, email, age, bio) VALUES ($1, $2, $3, $4)`,
      [
        faker.person.fullName(),
        faker.internet.email(),
        faker.number.int({ min: 18, max: 99 }),
        faker.lorem.sentence(),
      ]
    );
  });
  await Promise.all(userInsertPromises);

  // Seed posts
  const userIds = (await pool.query(`SELECT id FROM users`)).rows.map(
    (row) => row.id
  );
  const postInsertPromises = userIds.flatMap((userId) => {
    const postCount = faker.number.int({ min: 5, max: 10 });
    return Array.from({ length: postCount }).map(() => {
      return pool.query(
        `INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3)`,
        [faker.lorem.words(3), faker.lorem.paragraph(), userId]
      );
    });
  });
  await Promise.all(postInsertPromises);

  // Seed tags
  const tagInsertPromises = Array.from({ length: 5 }).map(() => {
    return pool.query(`INSERT INTO tags (title) VALUES ($1)`, [
      faker.lorem.word(),
    ]);
  });
  await Promise.all(tagInsertPromises);

  // Seed post_tag_pivot
  const postIds = (await pool.query(`SELECT id FROM posts`)).rows.map(
    (row) => row.id
  );
  const tagIds = (await pool.query(`SELECT id FROM tags`)).rows.map(
    (row) => row.id
  );
  const pivotInsertPromises = postIds.flatMap((postId) => {
    const tagCount = faker.number.int({ min: 1, max: tagIds.length });
    const selectedTags = faker.helpers.arrayElements(tagIds, tagCount);
    return selectedTags.map((tagId) => {
      return pool.query(
        `INSERT INTO post_tag_pivot (post_id, tag_id) VALUES ($1, $2)`,
        [postId, tagId]
      );
    });
  });
  await Promise.all(pivotInsertPromises);
}

// domain models

export interface DomainUser {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio?: string;
  created_at?: Date;
}

export interface DomainPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author?: DomainUser;
}

export interface DomainTag {
  id: string;
  title: string;
}
export interface DomainPostTagPivot {
  post_id: string;
  tag_id: string;
  post?: DomainPost;
  tag?: DomainTag;
}
