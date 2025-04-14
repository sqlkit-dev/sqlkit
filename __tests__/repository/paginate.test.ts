import { SqlExecutor, QueryResult, SimpleWhere, OrderBy } from "../../src";
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

describe("Repository paginate", () => {
  let repository: Repository<User>;

  beforeEach(() => {
    repository = new Repository("users", mockExecutor);
    jest.clearAllMocks();
  });

  it("should paginate results with default page size", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
      },
    ];

    const mockResult: QueryResult = {
      rows: mockUsers,
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.paginate({
      page: 1,
      limit: 10,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodes: mockUsers,
      meta: {
        totalCount: 2,
        currentPage: 1,
        hasNextPage: false,
        totalPages: 1,
      },
    });
  });

  it("should paginate results with custom page size", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
    ];

    const mockResult: QueryResult = {
      rows: mockUsers,
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.paginate({
      page: 2,
      limit: 1,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodes: mockUsers,
      meta: {
        totalCount: 1,
        currentPage: 2,
        hasNextPage: false,
        totalPages: 1,
      },
    });
  });

  it("should paginate results with where condition", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
    ];

    const mockResult: QueryResult = {
      rows: mockUsers,
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const where: SimpleWhere<User> = {
      key: "age",
      operator: ">",
      value: 25,
    };

    const result = await repository.paginate({
      page: 1,
      limit: 10,
      where,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodes: mockUsers,
      meta: {
        totalCount: 1,
        currentPage: 1,
        hasNextPage: false,
        totalPages: 1,
      },
    });
  });

  it("should paginate results with ordering", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        age: 30,
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "jane@example.com",
        age: 25,
      },
    ];

    const mockResult: QueryResult = {
      rows: mockUsers,
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const orderBy: OrderBy<User>[] = [
      {
        key: "age",
        direction: "desc",
      },
    ];

    const result = await repository.paginate({
      page: 1,
      limit: 10,
      orderBy,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodes: mockUsers,
      meta: {
        totalCount: 2,
        currentPage: 1,
        hasNextPage: false,
        totalPages: 1,
      },
    });
  });

  it("should handle empty result set", async () => {
    const mockResult: QueryResult = {
      rows: [],
    };

    mockExecutor.executeSQL.mockResolvedValueOnce(mockResult);

    const result = await repository.paginate({
      page: 1,
      limit: 10,
    });

    expect(mockExecutor.executeSQL).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      nodes: [],
      meta: {
        totalCount: 0,
        currentPage: 1,
        hasNextPage: false,
        totalPages: 0,
      },
    });
  });

  it("should handle errors during execution", async () => {
    const error = new Error("Database error");
    mockExecutor.executeSQL.mockRejectedValueOnce(error);

    await expect(
      repository.paginate({
        page: 1,
        limit: 10,
      })
    ).rejects.toThrow("Database error");
  });
});
