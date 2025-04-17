import {
  setupTestTables,
  cleanupTestData,
  executor,
  DomainUser,
} from "../../test-setup";
import { Repository } from "../../src";

describe("Repository - insertMany", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
    repository = new Repository("users", executor);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it("should insert multiple records into the database", async () => {
    const records = [
      { name: "John Doe", email: "john@example.com", age: 30 },
      { name: "Jane Smith", email: "jane@example.com", age: 25 },
    ];
    const result = await repository.insertMany(records);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject(records[0]);
    expect(result[1]).toMatchObject(records[1]);

    const insertedRecords = await executor.executeSQL(
      "SELECT * FROM users WHERE email IN ($1, $2)",
      ["john@example.com", "jane@example.com"],
    );

    expect(insertedRecords.rows).toHaveLength(2);
    expect(insertedRecords.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining(records[0]),
        expect.objectContaining(records[1]),
      ]),
    );
  });

  it("should throw an error if one of the records violates constraints", async () => {
    const records = [
      { name: "Valid User", email: "valid@example.com", age: 40 },
      { name: null, email: "invalid@example.com" }, // Assuming 'name' cannot be null
    ];

    // @ts-ignore
    await expect(repository.insertMany(records)).rejects.toThrow();
  });
});
