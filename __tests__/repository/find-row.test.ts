import { Repository } from "../../src/repository/repository";
import { eq, and, gt, like } from "../../src";
import {executor, setupTestTables, cleanupTestData, seedTestData, DomainUser} from "../../test-setup";



describe("Repository findRow", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
    await seedTestData();
    repository = new Repository("users", executor);
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  it("should find a single row by condition", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3)`,
      ["John Doe", "john@example.com", 30]
    );

    const result = await repository.findRow(eq("email", "john@example.com"));

    expect(result).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
  });

  it("should return null when no row is found", async () => {
    const result = await repository.findRow(eq("email", 'email-that-does-not-exists@example.com'));
    expect(result).toBeNull();
  });

  it("should handle complex where conditions", async () => {
    // Insert test data
    await executor.executeSQL(
      `INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *`,
      ["John Doe", "john@example.com", 30]
    );

    const result = await repository.findRow(
      and(eq("name", "John Doe"), gt("age", 25))
    );

    expect(result).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
  });

  it("should handle errors during execution", async () => {
    // Try to find a row with an invalid column name
    await expect(
      repository.findRow(eq("invalid_column" as any, "1"))
    ).rejects.toThrow();
  });
});
