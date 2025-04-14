import { Repository } from "../../src/repository/repository";
import { OrderBy } from "../../src/types/query";
import { gt, and, like } from "../../src/operators";
import { executor, setupTestTables, cleanupTestData } from "../setup";

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

describe("Repository findRows", () => {
  let repository: Repository<User>;

  beforeAll(async () => {
    await setupTestTables();
  });

  beforeEach(async () => {
    repository = new Repository("users", executor);
    await cleanupTestData();
  });

  it("should find multiple rows with simple condition", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.findRows({ where: gt("age", 20) });

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
      },
    ]);
  });

  it("should find rows with ordering", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const orderBy: OrderBy<User>[] = [
      {
        key: "age",
        direction: "desc",
      },
    ];

    const result = await repository.findRows({ orderBy });

    expect(result).toHaveLength(2);
    expect(result[0].age).toBe(30);
    expect(result[1].age).toBe(25);
  });

  it("should find rows with limit and offset", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.findRows({
      limit: 1,
      offset: 1,
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Jane Doe");
  });

  it("should return empty array when no rows are found", async () => {
    const result = await repository.findRows();

    expect(result).toEqual([]);
  });

  it("should handle errors during execution", async () => {
    // Try to find rows with an invalid column name
    await expect(
      repository.findRows({ where: gt("invalid_column" as any, 20) })
    ).rejects.toThrow();
  });
});
