import { faker } from "@faker-js/faker";
import mysql from "mysql2";
import { MySQLAdapter, Table } from "../../src";
import {
  integer,
  text,
  timestamp,
  uuid,
  varchar
} from "../../src/types/column-type";

// Test MySQL database configuration
const MYSQL_TEST_DB_CONFIG = {
  host: process.env.MYSQL_TEST_DB_HOST || "localhost",
  port: parseInt(process.env.MYSQL_TEST_DB_PORT || "3306"),
  database: process.env.MYSQL_TEST_DB_NAME || "sqlkit_test",
  user: process.env.MYSQL_TEST_DB_USER || "root",
  password: process.env.MYSQL_TEST_DB_PASSWORD || "password",
  multipleStatements: true
};

// Create MySQL executor for testing
const mysqlConnection = mysql.createConnection(MYSQL_TEST_DB_CONFIG);
export const mysqlExecutor = new MySQLAdapter(mysqlConnection);

// Create test tables for MySQL
export async function setupMySQLTestTables() {
  const userTable = new Table<any>("users");
  userTable.column("id", varchar(36)).primaryKey();
  userTable.column("name", varchar(255)).notNull();
  userTable.column("email", varchar(255)).notNull();
  userTable.column("age", integer());
  userTable.column("bio", text());
  userTable.column("created_at", timestamp());

  const postTable = new Table<any>("posts");
  postTable.column("id", varchar(36)).primaryKey();
  postTable.column("title", varchar(255)).notNull();
  postTable.column("content", text());
  postTable.column("author_id", varchar(36)).notNull().references({
    table: "users",
    column: "id",
    onDelete: "CASCADE"
  });

  const tagTable = new Table<any>("tags");
  tagTable.column("id", varchar(36)).primaryKey();
  tagTable.column("title", varchar(255)).notNull();

  const articleTagPivotTable = new Table<any>("post_tag_pivot");
  articleTagPivotTable.column("post_id", varchar(36)).notNull().references({
    table: "posts",
    column: "id",
    onDelete: "CASCADE"
  });
  articleTagPivotTable.column("tag_id", varchar(36)).notNull().references({
    table: "tags",
    column: "id",
    onDelete: "CASCADE"
  });

  await cleanupMySQLTestTables();

  // Convert PostgreSQL-specific SQL to MySQL-compatible SQL
  const createUserTableSQL = userTable
    .createTableSql()
    .replace(/UUID/g, "VARCHAR(36)")
    .replace(/NOW\(\)/g, "NOW()")
    .replace(/gen_random_uuid\(\)/g, "UUID()")
    .replace(/SERIAL/g, "AUTO_INCREMENT");

  const createPostsTableSql = postTable
    .createTableSql()
    .replace(/UUID/g, "VARCHAR(36)")
    .replace(/NOW\(\)/g, "NOW()")
    .replace(/gen_random_uuid\(\)/g, "UUID()")
    .replace(/SERIAL/g, "AUTO_INCREMENT");

  const createTagsTableSql = tagTable
    .createTableSql()
    .replace(/UUID/g, "VARCHAR(36)")
    .replace(/NOW\(\)/g, "NOW()")
    .replace(/gen_random_uuid\(\)/g, "UUID()")
    .replace(/SERIAL/g, "AUTO_INCREMENT");

  const createPostTagPivotTableSql = articleTagPivotTable
    .createTableSql()
    .replace(/UUID/g, "VARCHAR(36)")
    .replace(/NOW\(\)/g, "NOW()")
    .replace(/gen_random_uuid\(\)/g, "UUID()")
    .replace(/SERIAL/g, "AUTO_INCREMENT");

  await mysqlExecutor.executeSQL(createUserTableSQL, []);
  await mysqlExecutor.executeSQL(createPostsTableSql, []);
  await mysqlExecutor.executeSQL(createTagsTableSql, []);
  await mysqlExecutor.executeSQL(createPostTagPivotTableSql, []);
}

// Clean up MySQL test tables
export async function cleanupMySQLTestTables() {
  // Disable foreign key checks temporarily for cleanup
  await mysqlExecutor.executeSQL(`SET FOREIGN_KEY_CHECKS = 0`, []);

  await mysqlExecutor.executeSQL(`DROP TABLE IF EXISTS post_tag_pivot`, []);
  await mysqlExecutor.executeSQL(`DROP TABLE IF EXISTS posts`, []);
  await mysqlExecutor.executeSQL(`DROP TABLE IF EXISTS tags`, []);
  await mysqlExecutor.executeSQL(`DROP TABLE IF EXISTS users`, []);

  // Re-enable foreign key checks
  await mysqlExecutor.executeSQL(`SET FOREIGN_KEY_CHECKS = 1`, []);
}

// Clean up MySQL test data
export async function cleanupMySQLTestData() {
  // Disable foreign key checks temporarily for cleanup
  await mysqlExecutor.executeSQL(`SET FOREIGN_KEY_CHECKS = 0`, []);

  await mysqlExecutor.executeSQL(`DELETE FROM post_tag_pivot`, []);
  await mysqlExecutor.executeSQL(`DELETE FROM posts`, []);
  await mysqlExecutor.executeSQL(`DELETE FROM tags`, []);
  await mysqlExecutor.executeSQL(`DELETE FROM users`, []);

  // Re-enable foreign key checks
  await mysqlExecutor.executeSQL(`SET FOREIGN_KEY_CHECKS = 1`, []);
}

// Generate UUID-like string for MySQL
function generateId(): string {
  return faker.string.uuid();
}

// Seed test data for MySQL
export async function seedMySQLTestData() {
  // Seed users
  const userIds: string[] = [];
  for (let i = 0; i < 5; i++) {
    const userId = generateId();
    userIds.push(userId);
    await mysqlExecutor.executeSQL(
      `INSERT INTO users (id, name, email, age, bio, created_at) VALUES (?, ?, ?, ?, ?, NOW())`,
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
      await mysqlExecutor.executeSQL(
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
    await mysqlExecutor.executeSQL(
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
        await mysqlExecutor.executeSQL(
          `INSERT INTO post_tag_pivot (post_id, tag_id) VALUES (?, ?)`,
          [postId, tagId]
        );
      } catch (error) {
        // Ignore duplicate key errors
      }
    }
  }
}

// Close MySQL connection
export async function closeMySQLConnection() {
  return new Promise<void>((resolve) => {
    mysqlConnection.end(() => {
      resolve();
    });
  });
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
