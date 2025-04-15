import {Repository} from "../../src/repository/repository";
import {and, eq, gt, like} from "../../src";
import {cleanupTestData, DomainUser, executor, setupTestTables} from "../../test-setup";


describe("Repository count", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
  });

  beforeEach(async () => {
    repository = new Repository("users", executor);
    await cleanupTestData();
  });
  afterAll(async () => {
    await cleanupTestData();
  });

  it("should count all rows without condition", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.count(like("name", "%Doe%"));
    expect(result).toBe(2);
  });

  it("should count rows with condition", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.count(gt("age", 25));

    expect(result).toBe(1);
  });

  it("should return 0 when no rows match condition", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.count(gt("age", 100));

    expect(result).toBe(0);
  });

  it("should handle complex where conditions", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3), ($4, $5, $6) RETURNING *`,
      ["John Doe", "john@example.com", 30, "Jane Doe", "jane@example.com", 25]
    );

    const result = await repository.count(
      and(gt("age", 25), like("name", "%Doe%"))
    );

    expect(result).toBe(1);
  });

  it("should handle errors during execution", async () => {
    // Try to count with an invalid column name
    await expect(
      repository.count(eq("invalid_column" as any, 1))
    ).rejects.toThrow();
  });
});
