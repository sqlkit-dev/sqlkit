import { faker } from "@faker-js/faker";
const Database = require("better-sqlite3");
import { SQLiteAdapter, Table } from "../../src";
import {
  integer,
  text,
  timestamp,
  uuid,
  varchar
} from "../../src/types/column-type";

// Create in-memory SQLite database for testing
const db = new Database(":memory:");

// Create SQLite executor for testing
export const sqliteExecutor = new SQLiteAdapter(db);

// Create test tables for SQLite
export async function setupSQLiteTestTables() {
  // SQLite doesn't have UUID type, we'll use TEXT
  const userTable = new Table<any>("users");
  userTable.column("id", text()).primaryKey();
  userTable.column("name", varchar()).notNull();
  userTable.column("email", varchar()).notNull();
  userTable.column("age", integer());
  userTable.column("bio", text());
  userTable.column("created_at", timestamp());

  const postTable = new Table<any>("posts");
  postTable.column("id", text()).primaryKey();
  postTable.column("title", varchar()).notNull();
  postTable.column("content", text());
  postTable.column("author_id", text()).notNull().references({
    table: "users",
    column: "id",
    onDelete: "CASCADE"
  });

  const tagTable = new Table<any>("tags");
  tagTable.column("id", text()).primaryKey();
  tagTable.column("title", varchar()).notNull();

  const articleTagPivotTable = new Table<any>("post_tag_pivot");
  articleTagPivotTable.column("post_id", text()).notNull().references({
    table: "posts",
    column: "id",
    onDelete: "CASCADE"
  });
  articleTagPivotTable.column("tag_id", text()).notNull().references({
    table: "tags",
    column: "id",
    onDelete: "CASCADE"
  });

  await cleanupSQLiteTestTables();

  // Convert PostgreSQL-specific SQL to SQLite-compatible SQL
  const createUserTableSQL = userTable
    .createTableSql()
    .replace(/UUID/g, "TEXT")
    .replace(/NOW\(\)/g, "datetime('now')")
    .replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))");

  const createPostsTableSql = postTable
    .createTableSql()
    .replace(/UUID/g, "TEXT")
    .replace(/NOW\(\)/g, "datetime('now')")
    .replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))");

  const createTagsTableSql = tagTable
    .createTableSql()
    .replace(/UUID/g, "TEXT")
    .replace(/NOW\(\)/g, "datetime('now')")
    .replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))");

  const createPostTagPivotTableSql = articleTagPivotTable
    .createTableSql()
    .replace(/UUID/g, "TEXT")
    .replace(/NOW\(\)/g, "datetime('now')")
    .replace(/gen_random_uuid\(\)/g, "lower(hex(randomblob(16)))");

  await sqliteExecutor.executeSQL(createUserTableSQL, []);
  await sqliteExecutor.executeSQL(createPostsTableSql, []);
  await sqliteExecutor.executeSQL(createTagsTableSql, []);
  await sqliteExecutor.executeSQL(createPostTagPivotTableSql, []);
}

// Clean up SQLite test tables
export async function cleanupSQLiteTestTables() {
  try {
    await sqliteExecutor.executeSQL(`DROP TABLE IF EXISTS post_tag_pivot`, []);
    await sqliteExecutor.executeSQL(`DROP TABLE IF EXISTS posts`, []);
    await sqliteExecutor.executeSQL(`DROP TABLE IF EXISTS tags`, []);
    await sqliteExecutor.executeSQL(`DROP TABLE IF EXISTS users`, []);
  } catch (error) {
    // Ignore errors when dropping tables that don't exist
  }
}

// Clean up SQLite test data
export async function cleanupSQLiteTestData() {
  try {
    await sqliteExecutor.executeSQL(`DELETE FROM post_tag_pivot`, []);
    await sqliteExecutor.executeSQL(`DELETE FROM posts`, []);
    await sqliteExecutor.executeSQL(`DELETE FROM tags`, []);
    await sqliteExecutor.executeSQL(`DELETE FROM users`, []);
  } catch (error) {
    // Ignore errors when deleting from tables that don't exist
  }
}

// Generate UUID-like string for SQLite
function generateId(): string {
  return faker.string.uuid();
}

// Seed test data for SQLite
export async function seedSQLiteTestData() {
  // Seed users
  const userIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const userId = generateId();
    userIds.push(userId);
    await sqliteExecutor.executeSQL(
      `INSERT INTO users (id, name, email, age, bio, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [
        userId,
        faker.person.fullName(),
        faker.internet.email(),
        faker.number.int({ min: 18, max: 99 }),
        faker.lorem.sentence()
      ]
    );
  }

  // Seed posts
  const postIds: string[] = [];
  for (const userId of userIds) {
    const postCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < postCount; i++) {
      const postId = generateId();
      postIds.push(postId);
      await sqliteExecutor.executeSQL(
        `INSERT INTO posts (id, title, content, author_id) VALUES (?, ?, ?, ?)`,
        [postId, faker.lorem.words(3), faker.lorem.paragraph(), userId]
      );
    }
  }

  // Seed tags
  const tagIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const tagId = generateId();
    tagIds.push(tagId);
    await sqliteExecutor.executeSQL(
      `INSERT INTO tags (id, title) VALUES (?, ?)`,
      [tagId, faker.lorem.word()]
    );
  }

  // Seed post_tag_pivot
  for (const postId of postIds) {
    const tagCount = faker.number.int({ min: 1, max: tagIds.length });
    const selectedTags = faker.helpers.arrayElements(tagIds, tagCount);
    for (const tagId of selectedTags) {
      try {
        await sqliteExecutor.executeSQL(
          `INSERT INTO post_tag_pivot (post_id, tag_id) VALUES (?, ?)`,
          [postId, tagId]
        );
      } catch (error) {
        // Ignore duplicate key errors
      }
    }
  }
}

// Domain models (same as PostgreSQL)
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
