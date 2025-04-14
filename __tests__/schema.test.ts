import {Table} from "../src/schema";
import {integer, serial, text, timestamp, uuid, varchar} from "../src/types/column-type";

// Define test interfaces
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  content?: string;
  authorId: string;
  createdAt: Date;
}

describe("Schema and Table", () => {
  describe("Table Creation", () => {
    it("should create a table with basic columns", () => {
      const table = new Table<User>("users");
      table.column("id", uuid());
      table.column("name", varchar(255));
      table.column("email", varchar(255));
      table.column("age", integer());
      table.column("createdAt", timestamp()).default("now()");
      const sql = table.createTableSql();
      expect(sql).toContain("CREATE TABLE IF NOT EXISTS users");
      expect(sql).toContain('"id" UUID');
      expect(sql).toContain('"name" VARCHAR(255)');
      expect(sql).toContain('"email" VARCHAR(255)');
      expect(sql).toContain('"age" INTEGER');
      expect(sql).toContain('"createdAt" TIMESTAMP');
    });

    it("should create a table with primary key", () => {
      const table = new Table<User>("users");
      table.column("id", uuid()).primaryKey();
      table.column("name", varchar());

      const sql = table.createTableSql()
      expect(sql).toContain(`UUID PRIMARY KEY NOT NULL`);
    });

    it("should create a table with not null constraints", () => {
      const table = new Table<User>("users");
      table.column("id", serial()).primaryKey();
      table.column("name", varchar()).notNull();
      table.column("email", varchar()).notNull();

      const sql = table.createTableSql();
      expect(sql).toContain('"name" VARCHAR(255) NOT NULL');
      expect(sql).toContain('"email" VARCHAR(255) NOT NULL');
    });

    it("should create a table with unique constraints", () => {
      const table = new Table<User>("users");
      table.column("id", uuid()).primaryKey();
      table.column("email", varchar()).unique();

      const sql = table.createTableSql();
      expect(sql).toContain('"email" VARCHAR(255) UNIQUE');
    });

    it("should create a table with default values", () => {
      const table = new Table<User>("users");
      table.column("id", uuid()).primaryKey().$defaultUUID();
      table.column("createdAt", timestamp()).default("now()");

      // CREATE TABLE IF NOT EXISTS users (
      //   "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      //   "createdAt" TIMESTAMP DEFAULT 'now()'
      // );

      const sql = table.createTableSql();
      expect(sql).toContain(`"id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()`);
      expect(sql).toContain(`"createdAt" TIMESTAMP DEFAULT 'now()'`);
    });

    it("should create a table with foreign key references", () => {
      const table = new Table<Post>("posts");
      table.column("id", uuid()).primaryKey().$defaultUUID();
      table.column("authorId", uuid()).references({table: "users", column: "id", onDelete: 'CASCADE'});

      const sql = table.createTableSql();
      expect(sql).toContain('"authorId" UUID REFERENCES users(id)');
    });

    it("should create a table with all constraints combined", () => {
      const table = new Table<User>("users");
      table.column("id", uuid()).primaryKey().$defaultUUID();
      table.column("name", varchar()).notNull();
      table.column("email", varchar()).unique().notNull();
      table.column("age", integer());
      table
          .column("createdAt", timestamp())
          .default("CURRENT_TIMESTAMP")
          .notNull();

      // CREATE TABLE IF NOT EXISTS users (
      //   "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
      //   "name" VARCHAR(255) NOT NULL,
      //   "email" VARCHAR(255) NOT NULL UNIQUE,
      //   "age" INTEGER,
      //   "createdAt" TIMESTAMP NOT NULL DEFAULT 'CURRENT_TIMESTAMP'
      // );
      const sql = table.createTableSql();
      expect(sql).toContain(`"id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid()`);
      expect(sql).toContain(`"name" VARCHAR(255) NOT NULL`);
      expect(sql).toContain(`"email" VARCHAR(255) NOT NULL UNIQUE`);
      expect(sql).toContain(`"age" INTEGER`);
      expect(sql).toContain(`"createdAt" TIMESTAMP NOT NULL DEFAULT 'CURRENT_TIMESTAMP'`);
    });


    it("should handle complex table relationships", () => {
      const usersTable = new Table<User>("users");
      usersTable.column("id", uuid()).primaryKey();
      usersTable.column("name", varchar()).notNull();

      const postsTable = new Table<Post>("posts");
      postsTable.column("id", uuid()).primaryKey();
      postsTable.column("title", varchar()).notNull();
      postsTable.column("content", text());
      postsTable.column("authorId", uuid()).notNull().references({
        table: "users",
        column: "id",
        onDelete: 'CASCADE'
      });
      postsTable
        .column("createdAt", timestamp())
        .$defaultNOW()
        .notNull();

      const postsSql = postsTable.createTableSql();

      // CREATE TABLE IF NOT EXISTS posts (
      //   "id" UUID PRIMARY KEY NOT NULL,
      //   "title" VARCHAR(255) NOT NULL,
      //   "content" TEXT,
      //   "authorId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      //   "createdAt" TIMESTAMP NOT NULL DEFAULT 'now()'
      // );

      expect(postsSql).toContain(`"authorId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE`);
      expect(postsSql).toContain(`"createdAt" TIMESTAMP NOT NULL DEFAULT 'now()'`);
    });
  });
});
