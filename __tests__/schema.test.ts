import {Table} from "../src/schema";
import {integer, serial, timestamp, uuid, varchar} from "../src/types/column-type";

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

      const sql = table.createTableSql();
      expect(sql).toContain('"createdAt" TIMESTAMP DEFAULT now()');
    });

    it("should create a table with foreign key references", () => {
      const table = new Table<Post>("posts");
      table.column("id", uuid()).primaryKey().$defaultUUID();
      table.column("authorId", uuid()).references({table: "users", column: "id", onDelete: 'CASCADE'});

      const sql = table.createTableSql();
      expect(sql).toContain('"authorId" UUID REFERENCES users(id)');
    });
    //
    // it("should create a table with all constraints combined", () => {
    //   const table = new Table<User>("users");
    //   table.column("id", "UUID").primaryKey();
    //   table.column("name", "VARCHAR(255)").notNull();
    //   table.column("email", "VARCHAR(255)").unique().notNull();
    //   table.column("age", "INTEGER");
    //   table
    //     .column("createdAt", "TIMESTAMP")
    //     .default("CURRENT_TIMESTAMP")
    //     .notNull();
    //
    //   const sql = table.toString();
    //   expect(sql).toContain('"id" UUID PRIMARY KEY');
    //   expect(sql).toContain('"name" VARCHAR(255) NOT NULL');
    //   expect(sql).toContain('"email" VARCHAR(255) UNIQUE NOT NULL');
    //   expect(sql).toContain('"age" INTEGER');
    //   expect(sql).toContain(
    //     '"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
    //   );
    // });
    //
    // it("should handle complex table relationships", () => {
    //   const usersTable = new Table<User>("users");
    //   usersTable.column("id", "UUID").primaryKey();
    //   usersTable.column("name", "VARCHAR(255)").notNull();
    //
    //   const postsTable = new Table<Post>("posts");
    //   postsTable.column("id", "UUID").primaryKey();
    //   postsTable.column("title", "VARCHAR(255)").notNull();
    //   postsTable.column("content", "TEXT");
    //   postsTable.column("authorId", "UUID").notNull().references("users", "id");
    //   postsTable
    //     .column("createdAt", "TIMESTAMP")
    //     .default("CURRENT_TIMESTAMP")
    //     .notNull();
    //
    //   const postsSql = postsTable.toString();
    //   expect(postsSql).toContain(
    //     '"authorId" UUID NOT NULL REFERENCES users(id)'
    //   );
    //   expect(postsSql).toContain(
    //     '"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL'
    //   );
    // });
    //
    // it("should handle different default value types", () => {
    //   const table = new Table<any>("test");
    //   table.column("id", "UUID").primaryKey();
    //   table.column("stringDefault", "VARCHAR(255)").default("default value");
    //   table.column("numberDefault", "INTEGER").default(42);
    //   table.column("nullDefault", "VARCHAR(255)").default(null);
    //
    //   const sql = table.toString();
    //   expect(sql).toContain(
    //     "\"stringDefault\" VARCHAR(255) DEFAULT 'default value'"
    //   );
    //   expect(sql).toContain('"numberDefault" INTEGER DEFAULT 42');
    //   expect(sql).toContain('"nullDefault" VARCHAR(255) DEFAULT NULL');
    // });
  });
});
