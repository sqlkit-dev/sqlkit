import { DeleteQueryBuilder, SqlExecutor } from "../src";
import { SimpleWhere, CompositeWhere } from "../src";

// Mock SqlExecutor
const mockExecutor: SqlExecutor = {
  executeSQL: jest.fn(),
};

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  roleId?: string;
}

describe("DeleteQueryBuilder", () => {
  let builder: DeleteQueryBuilder<User>;

  beforeEach(() => {
    builder = new DeleteQueryBuilder("users", mockExecutor);
    jest.clearAllMocks();
  });

  describe("Basic Delete", () => {
    it("should build correct SQL for basic delete", () => {
      const result = builder.build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain("RETURNING *");
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for delete with specific returning columns", () => {
      const result = builder.returning(["id", "name"]).build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain("RETURNING id, name");
      expect(result.values).toEqual([]);
    });
  });

  describe("Where Conditions", () => {
    it("should build correct SQL for simple where condition", () => {
      const where: SimpleWhere<User> = {
        key: "age",
        operator: ">",
        value: 18,
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain(`WHERE "users"."age" > $1`);
      expect(result.sql).toContain("RETURNING *");
      expect(result.values).toEqual([18]);
    });

    it("should build correct SQL for composite AND condition", () => {
      const where: CompositeWhere<User> = {
        AND: [
          { key: "age", operator: ">", value: 18 } as SimpleWhere<User>,
          { key: "name", operator: "=", value: "John" } as SimpleWhere<User>,
        ],
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 AND "users"."name" = $2)`,
      );
      expect(result.sql).toContain("RETURNING *");
      expect(result.values).toEqual([18, "John"]);
    });

    it("should build correct SQL for composite OR condition", () => {
      const where: CompositeWhere<User> = {
        OR: [
          { key: "age", operator: ">", value: 18 } as SimpleWhere<User>,
          { key: "name", operator: "=", value: "John" } as SimpleWhere<User>,
        ],
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 OR "users"."name" = $2)`,
      );
      expect(result.sql).toContain("RETURNING *");
      expect(result.values).toEqual([18, "John"]);
    });

    it("should build correct SQL for complex nested conditions", () => {
      const where: CompositeWhere<User> = {
        AND: [
          { key: "age", operator: ">", value: 18 } as SimpleWhere<User>,
          {
            OR: [
              {
                key: "name",
                operator: "=",
                value: "John",
              } as SimpleWhere<User>,
              {
                key: "name",
                operator: "=",
                value: "Jane",
              } as SimpleWhere<User>,
            ],
          } as CompositeWhere<User>,
        ],
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 AND ("users"."name" = $2 OR "users"."name" = $3))`,
      );
      expect(result.sql).toContain("RETURNING *");
      expect(result.values).toEqual([18, "John", "Jane"]);
    });
  });

  describe("Complex Delete", () => {
    it("should build correct SQL for complex delete with all clauses", () => {
      const where: CompositeWhere<User> = {
        AND: [
          { key: "age", operator: ">", value: 18 } as SimpleWhere<User>,
          {
            OR: [
              {
                key: "name",
                operator: "=",
                value: "John",
              } as SimpleWhere<User>,
              {
                key: "name",
                operator: "=",
                value: "Jane",
              } as SimpleWhere<User>,
            ],
          } as CompositeWhere<User>,
        ],
      };

      const result = builder
        .where(where)
        .returning(["id", "name", "email"])
        .build();

      expect(result.sql).toContain(`DELETE FROM "users"`);
      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 AND ("users"."name" = $2 OR "users"."name" = $3))`,
      );
      expect(result.sql).toContain("RETURNING id, name, email");
      expect(result.values).toEqual([18, "John", "Jane"]);
    });
  });
});
