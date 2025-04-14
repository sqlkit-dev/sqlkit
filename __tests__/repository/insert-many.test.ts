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

describe("Repository insertMany", () => {
  let repository: Repository<User>;

  beforeEach(() => {
    repository = new Repository("users", mockExecutor);
    jest.clearAllMocks();
  });

  it("should insert multiple records and return them", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
      },
    ];

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          ...mockUsers[0],
        },
        {
          id: "2",
          ...mockUsers[1],
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertMany(mockUsers);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows);
  });

  it("should insert records with specific returning columns", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
      },
    ];

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: mockUsers[0].name,
        },
        {
          id: "2",
          name: mockUsers[1].name,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertMany(mockUsers, ["id", "name"]);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows);
  });

  it("should handle null values", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: null as any,
        age: null as any,
      },
      {
        name: "Jane Doe",
        email: null as any,
        age: null as any,
      },
    ];

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          ...mockUsers[0],
        },
        {
          id: "2",
          ...mockUsers[1],
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertMany(mockUsers);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows);
  });

  it("should handle undefined values", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: "john@example.com",
        age: undefined,
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        age: undefined,
      },
    ];

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: mockUsers[0].name,
          email: mockUsers[0].email,
          age: null,
        },
        {
          id: "2",
          name: mockUsers[1].name,
          email: mockUsers[1].email,
          age: null,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertMany(mockUsers);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows);
  });

  it("should handle different column sets", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: "john@example.com",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
      },
    ];

    const mockResult: QueryResult = {
      rows: [
        {
          id: "1",
          name: mockUsers[0].name,
          email: mockUsers[0].email,
          age: null,
        },
        {
          id: "2",
          name: mockUsers[1].name,
          email: mockUsers[1].email,
          age: mockUsers[1].age,
        },
      ],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.insertMany(mockUsers);

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult.rows);
  });

  it("should handle errors during execution", async () => {
    const mockUsers: Partial<User>[] = [
      {
        name: "John Doe",
        email: "john@example.com",
      },
    ];

    const error = new Error("Database error");
    mockExecutor.executeSQL.mockRejectedValueOnce(error);

    await expect(repository.insertMany(mockUsers)).rejects.toThrow(
      "Database error"
    );
  });
});
