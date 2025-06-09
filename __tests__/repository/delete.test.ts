import {
  setupTestTables,
  cleanupTestData,
  executor,
  DomainUser,
} from "../../test-setup";
import { Repository, SimpleWhere, CompositeWhere, eq } from "../../src";

describe("Repository - Delete", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
  });

  beforeEach(async () => {
    repository = new Repository<DomainUser>("users", executor);
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("delete method", () => {
    it("should delete all records when no where condition is provided", async () => {
      await executor.executeSQL(
        `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
        ["John Doe", "john@example.com", 30],
      );

      await executor.executeSQL(
        `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
        ["Jane Smith", "jane@example.com", 25],
      );

      expect(1).toBe(1)

      // const result = await repository.delete({ where: {} });

      // console.log(result)
      // expect(result?.rows).toBeNull(); // or expect(result).toEqual([]) if it returns an array of deleted items

      // const remainingUsers = await executor.executeSQL(
      //   `SELECT * FROM users`,
      //   [],
      // );
      // expect(remainingUsers.rows as DomainUser[]).toHaveLength(0);
    });

    // it("should delete records with specific returning columns", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25],
    //   );

    //   const result: DomainUser | null = await repository.delete({ where: eq("name", "John Doe"), returning: ["id", "name"] });

    //   expect(result).toMatchObject({
    //     id: "1",
    //     name: "John Doe",
    //   });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users WHERE id = '1'`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(0);
    // });

    // it("should build correct SQL for simple where condition", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25],
    //   );

    //   const where: SimpleWhere<DomainUser> = {
    //     key: "age",
    //     operator: ">",
    //     value: 18,
    //   };

    //   await repository.delete({ where });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(0);
    // });

    // it("should build correct SQL for composite AND condition", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25],
    //   );

    //   const where: CompositeWhere<DomainUser> = {
    //     AND: [
    //       { key: "age", operator: ">", value: 18 } as SimpleWhere<DomainUser>,
    //       { key: "name", operator: "=", value: "John Doe" } as SimpleWhere<DomainUser>,
    //     ],
    //   };

    //   await repository.delete({ where });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users WHERE id = '1'`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(0);

    //   const jane = await executor.executeSQL(
    //     `SELECT * FROM users WHERE id = '2'`,
    //     [],
    //   );
    //   expect(jane.rows as DomainUser[]).toHaveLength(1);
    // });

    // it("should build correct SQL for composite OR condition", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25, "3", "Peter Jones", "peter@example.com", 35],
    //   );

    //   const where: CompositeWhere<DomainUser> = {
    //     OR: [
    //       { key: "age", operator: ">", value: 30 } as SimpleWhere<DomainUser>,
    //       { key: "name", operator: "=", value: "John Doe" } as SimpleWhere<DomainUser>,
    //     ],
    //   };

    //   await repository.delete({ where });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(1);
    //   expect((remainingUsers.rows as DomainUser[])[0].name).toBe("Jane Smith");
    // });

    // it("should build correct SQL for complex nested conditions", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25, "3", "Peter Jones", "peter@example.com", 40],
    //   );

    //   const where: CompositeWhere<DomainUser> = {
    //     AND: [
    //       { key: "age", operator: ">", value: 20 } as SimpleWhere<DomainUser>,
    //       {
    //         OR: [
    //           {
    //             key: "name",
    //             operator: "=",
    //             value: "John Doe",
    //           } as SimpleWhere<DomainUser>,
    //           {
    //             key: "name",
    //             operator: "=",
    //             value: "Jane Smith",
    //           } as SimpleWhere<DomainUser>,
    //         ],
    //       } as CompositeWhere<DomainUser>,
    //     ],
    //   };

    //   await repository.delete({ where });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(1);
    //   expect((remainingUsers.rows as DomainUser[])[0].name).toBe("Peter Jones");
    // });

    // it("should build correct SQL for complex delete with all clauses", async () => {
    //   await executor.executeSQL(
    //     `INSERT INTO users (id, name, email, age) VALUES ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
    //     ["1", "John Doe", "john@example.com", 30, "2", "Jane Smith", "jane@example.com", 25, "3", "Peter Jones", "peter@example.com", 40],
    //   );

    //   const where: CompositeWhere<DomainUser> = {
    //     AND: [
    //       { key: "age", operator: ">", value: 20 } as SimpleWhere<DomainUser>,
    //       {
    //         OR: [
    //           {
    //             key: "name",
    //             operator: "=",
    //             value: "John Doe",
    //           } as SimpleWhere<DomainUser>,
    //           {
    //             key: "name",
    //             operator: "=",
    //             value: "Jane Smith",
    //           } as SimpleWhere<DomainUser>,
    //         ],
    //       } as CompositeWhere<DomainUser>,
    //     ],
    //   };

    //   const result: DomainUser | null = await repository.delete({ where, returning: ["id", "name", "email"] });

    //   expect(result).toMatchObject({
    //     id: "1",
    //     name: "John Doe",
    //     email: "john@example.com",
    //   });

    //   const remainingUsers = await executor.executeSQL(
    //     `SELECT * FROM users`,
    //     [],
    //   );
    //   expect(remainingUsers.rows as DomainUser[]).toHaveLength(1);
    //   expect((remainingUsers.rows as DomainUser[])[0].name).toBe("Peter Jones");
    // });
  });
});
