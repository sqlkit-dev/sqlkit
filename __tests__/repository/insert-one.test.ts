import {
  setupTestTables,
  cleanupTestData,
  executor,
  DomainUser,
} from "../../test-setup";
import { Repository } from "../../src/repository/repository";

describe("Repository - insertOne", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
    repository = new Repository("users", executor);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it("should insert a single record into the database", async () => {
    const record = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };
    const result = await repository.insertOne(record);

    expect(result).toMatchObject({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });

    const insertedRecord = await executor.executeSQL(
      "SELECT * FROM users WHERE email = $1",
      ["john@example.com"]
    );

    expect(insertedRecord.rows[0]).toMatchObject(record);
  });

  it("should throw an error if the record violates constraints", async () => {
    const record = { name: null, email: "invalid@example.com" }; // Assuming 'name' cannot be null

    // @ts-ignore
    await expect(repository.insertOne(record)).rejects.toThrow();
  });
});
