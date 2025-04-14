import { SqlExecutor, QueryResult } from "../../src";
import { Repository } from "../../src/repository/repository";
import { eq, gt, and, like } from "../../src/operators";

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

describe("Repository update", () => {
  let repository: Repository<User>;

  beforeEach(() => {
    repository = new Repository("users", mockExecutor);
    jest.clearAllMocks();
  });

  it("should update a record and return it", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
      age: 31,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: data.name,
          email: "john@example.com",
          age: data.age,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: eq("id", "1"),
      data,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should update a record with specific returning columns", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: data.name,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: eq("id", "1"),
      data,
      returning: ["id", "name"],
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle null values", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
      email: null as any,
      age: null as any,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          ...data,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: eq("id", "1"),
      data,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle undefined values", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
      age: undefined,
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: data.name,
          email: "john@example.com",
          age: null,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: eq("id", "1"),
      data,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should return null when no record is updated", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
    };

    const mockResult: QueryResult = {
      rows: [],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: eq("id", "999"),
      data,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  it("should handle complex where conditions", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
    };

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: data.name,
          email: "john@example.com",
          age: 30,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.update({
      where: and(gt("age", 25), like("name", "%Doe%")),
      data,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows[0]);
  });

  it("should handle errors during execution", async () => {
    const data: Partial<User> = {
      name: "John Doe Updated",
    };

    const error = new Error("Database error");
    mockExecutor.executeSQL.mockRejectedValueOnce(error);

    await expect(
      repository.update({
        where: eq("id", "1"),
        data,
      })
    ).rejects.toThrow("Database error");
  });
});
