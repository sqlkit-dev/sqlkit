import { SqlExecutor, QueryResult } from "../../src";
import { Repository } from "../../src/repository/repository";

// Mock SqlExecutor
const mockExecutor: jest.Mocked<SqlExecutor> = {
  executeSQL: jest.fn(),
};

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}

describe("Repository insertOne", () => {
  let repository: Repository<User>;

  beforeEach(() => {
    repository = new Repository("users", mockExecutor);
    jest.clearAllMocks();
  });

  it("should insert a single record and return it", async () => {
    const mockUser: Partial<User> = {
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          ...mockUser,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertOne(mockUser);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should insert a record with specific returning columns", async () => {
    const mockUser: Partial<User> = {
      name: "John Doe",
      email: "john@example.com",
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: mockUser.name,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertOne(mockUser, ["id", "name"]);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle null values", async () => {
    const mockUser: Partial<User> = {
      name: "John Doe",
      email: null as any,
      age: null as any,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          ...mockUser,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertOne(mockUser);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle undefined values", async () => {
    const mockUser: Partial<User> = {
      name: "John Doe",
      email: "john@example.com",
      age: undefined,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: mockUser.name,
          email: mockUser.email,
          age: null,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertOne(mockUser);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle errors during execution", async () => {
    const mockUser: Partial<User> = {
      name: "John Doe",
      email: "john@example.com",
    };

    const error = new Error("Database error");
    mockExecutor.executeSQL.mockRejectedValueOnce(error);

    await expect(repository.insertOne(mockUser)).rejects.toThrow(
      "Database error"
    );
  });
});
