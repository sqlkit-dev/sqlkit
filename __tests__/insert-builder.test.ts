import { InsertQueryBuilder } from "../src/query-builder/insert";
import { SqlExecutor } from "../src/types/common";

// Mock SqlExecutor
const mockExecutor: SqlExecutor = {
  executeSQL: jest.fn(),
};

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

describe("InsertQueryBuilder", () => {
  let builder: InsertQueryBuilder<User>;

  beforeEach(() => {
    builder = new InsertQueryBuilder("users", mockExecutor);
    jest.clearAllMocks();
  });

  describe("Single Insert", () => {
    it("should build correct SQL for single record insertion", () => {
      const mockUser: Omit<User, "id"> = {
        name: "King Rayhan",
        email: "example@example.com",
        age: 26,
      };
      const result = builder
        .values({
          name: mockUser.name,
          email: mockUser.email,
          age: mockUser.age,
        })
        .build();

      expect(result.sql).toContain(
        'INSERT INTO users ("name", "email", "age")'
      );
      expect(result.sql).toContain("VALUES ($1, $2, $3)");
      expect(result.sql).toContain(`RETURNING *`);
      expect(result.values).toEqual([
        mockUser.name,
        mockUser.email,
        mockUser.age,
      ]);
    });

    it("should handle returning specific columns", () => {
      const mockUser: Omit<User, "id"> = {
        name: "King Rayhan",
        email: "example@example.com",
        age: 26,
      };

      const result = builder
        .values(mockUser)
        .returning(["name", "age"])
        .build();

      expect(result.sql).toContain("RETURNING name, age");
    });
  });

  // describe("Bulk Insert", () => {
  //   it("should build correct SQL for bulk insertion", () => {
  //     const data = [
  //       {
  //         firstName: "John",
  //         lastName: "Doe",
  //         age: 30,
  //       },
  //       {
  //         firstName: "Jane",
  //         lastName: "Smith",
  //         age: 25,
  //       },
  //     ];

  //     const result = builder.values(data).build();

  //     expect(result.sql).toContain(
  //       'INSERT INTO users ("first_name", "last_name", "age")'
  //     );
  //     expect(result.sql).toContain("VALUES ($1, $2, $3), ($4, $5, $6)");
  //     expect(result.values).toEqual(["John", "Doe", 30, "Jane", "Smith", 25]);
  //   });

  //   it("should handle missing fields in some records", () => {
  //     const data = [
  //       {
  //         firstName: "John",
  //         lastName: "Doe",
  //         age: 30,
  //       },
  //       {
  //         firstName: "Jane",
  //         lastName: "Smith",
  //       },
  //     ];

  //     const result = builder.values(data).build();

  //     expect(result.sql).toContain(
  //       'INSERT INTO users ("first_name", "last_name", "age")'
  //     );
  //     expect(result.sql).toContain("VALUES ($1, $2, $3), ($4, $5, $6)");
  //     expect(result.values).toEqual(["John", "Doe", 30, "Jane", "Smith", null]);
  //   });

  //   it("should throw error for empty bulk insert", () => {
  //     expect(() => {
  //       builder.values([]).build();
  //     }).toThrow("No data provided for bulk insert");
  //   });
  // });

  // describe("Column Name Transformation", () => {
  //   it("should convert camelCase to snake_case", () => {
  //     const data = {
  //       firstName: "John",
  //       lastName: "Doe",
  //       dateOfBirth: "1990-01-01",
  //     };

  //     const result = builder.values(data).build();

  //     expect(result.sql).toContain(
  //       '"first_name", "last_name", "date_of_birth"'
  //     );
  //   });
  // });

  // describe("Value Placeholders", () => {
  //   it("should generate correct placeholders for values", () => {
  //     const data = {
  //       firstName: "John",
  //       lastName: "Doe",
  //       age: 30,
  //     };

  //     const result = builder.values(data).build();

  //     expect(result.sql).toContain("VALUES ($1, $2, $3)");
  //     expect(result.values).toEqual(["John", "Doe", 30]);
  //   });

  //   it("should handle null values correctly", () => {
  //     const data = {
  //       firstName: "John",
  //       lastName: null,
  //       age: 30,
  //     };

  //     const result = builder.values(data).build();

  //     expect(result.sql).toContain("VALUES ($1, $2, $3)");
  //     expect(result.values).toEqual(["John", null, 30]);
  //   });
  // });
});
