import { SqlExecutor, QueryResult } from "../../src";
import { Repository } from "../../src/repository/repository";
import { eq, gt, and, like } from "../../src";
import {DomainUser} from "../../test-setup";

// Mock SqlExecutor
const mockExecutor: jest.Mocked<SqlExecutor> = {
  executeSQL: jest.fn(),
};

describe("Repository delete", () => {
  let repository: Repository<DomainUser>;

  beforeEach(() => {
    repository = new Repository("users", mockExecutor);
    jest.clearAllMocks();
  });

  it("should delete a record and return it", async () => {
    const mockUser: Omit<DomainUser, 'created_at'> = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const mockResult: QueryResult = {
      rows: [mockUser],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.delete(eq("id", "1"));

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it("should delete a record with specific returning columns", async () => {
    const mockUser: Partial<DomainUser> = {
      id: "1",
      name: "John Doe",
    };

    const mockResult: QueryResult = {
      rows: [mockUser],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.delete(eq("id", "1"), ["id", "name"]);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it("should return null when no record is deleted", async () => {
    const mockResult: QueryResult = {
      rows: [],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.delete(eq("id", "999"));

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("should handle complex where conditions", async () => {
    const mockUser: DomainUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const mockResult: QueryResult = {
      rows: [mockUser],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.delete(
      and(gt("age", 25), like("name", "%Doe%"))
    );

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it("should handle errors during execution", async () => {
    const error = new Error("Database error");
    mockExecutor.executeSQL.mockRejectedValueOnce(error);

    await expect(repository.delete(eq("id", "1"))).rejects.toThrow(
      "Database error"
    );
  });
});
