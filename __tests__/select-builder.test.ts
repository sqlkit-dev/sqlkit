import {
  CompositeWhere,
  Join,
  OrderBy,
  SelectQueryBuilder,
  SimpleWhere,
  SqlExecutor,
} from "../src";

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

interface Role {
  id: string;
  name: string;
  description: string;
}

describe("SelectQueryBuilder", () => {
  let builder: SelectQueryBuilder<User>;

  beforeEach(() => {
    builder = new SelectQueryBuilder("users", mockExecutor);
    jest.clearAllMocks();
  });

  describe("Basic Select", () => {
    it("should build correct SQL for basic select", () => {
      const result = builder.build();

      expect(result.sql).toContain(`SELECT "users".*`);
      expect(result.sql).toContain(`FROM "users"`);
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for specific columns", () => {
      const result = builder.select(["name", "email"]).build();

      expect(result.sql).toContain(`SELECT "users"."name","users"."email"`);
      expect(result.sql).toContain(`FROM "users"`);
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

      expect(result.sql).toContain(`WHERE "users"."age" > $1`);
      expect(result.values).toEqual([18]);
    });

    it("should build correct SQL for composite AND condition", () => {
      const where: CompositeWhere<User> = {
        AND: [
          { key: "age", operator: ">", value: 18 },
          { key: "name", operator: "=", value: "John" },
        ],
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 AND "users"."name" = $2)`,
      );
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

      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 OR "users"."name" = $2)`,
      );
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
              },
              {
                key: "name",
                operator: "=",
                value: "Jane",
              },
            ],
          },
        ],
      };

      const result = builder.where(where).build();

      expect(result.sql).toContain(
        `WHERE ("users"."age" > $1 AND ("users"."name" = $2 OR "users"."name" = $3))`,
      );
      expect(result.values).toEqual([18, "John", "Jane"]);
    });
  });

  describe("Joins", () => {
    it("should build correct SQL for inner join", () => {
      const join: Join<User, Role> = {
        table: "roles",
        type: "inner",
        on: {
          localField: "roleId",
          foreignField: "id",
        },
      };

      const result = builder.join(join).build();

      expect(result.sql).toContain(
        `INNER JOIN "roles" AS "roles" ON "roles"."id" = "users"."roleId"`,
      );
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for left join with specific columns", () => {
      const join: Join<User, Role> = {
        table: "roles",
        type: "left",
        on: {
          localField: "roleId",
          foreignField: "id",
        },
        columns: ["name", "description"],
      };

      const result = builder.join(join).build();

      expect(result.sql).toContain(
        `LEFT JOIN "roles" AS "roles" ON "roles"."id" = "users"."roleId"`,
      );
      expect(result.sql).toContain(
        `json_build_object('name', "roles"."name", 'description', "roles"."description") AS roles`,
      );
      expect(result.values).toEqual([]);
    });
  });

  describe("Order By", () => {
    it("should build correct SQL for single order by", () => {
      const orderBy: OrderBy<User> = {
        key: "name",
        direction: "asc",
      };

      const result = builder.orderBy(orderBy).build();

      expect(result.sql).toContain(`ORDER BY "users"."name" ASC`);
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for multiple order by", () => {
      const orderBy: OrderBy<User>[] = [
        { key: "name", direction: "asc" },
        { key: "age", direction: "desc" },
      ];

      const result = builder.orderBy(orderBy).build();

      expect(result.sql).toContain(
        `ORDER BY "users"."name" ASC NULLS FIRST, "users"."age" DESC NULLS LAST`,
      );
      expect(result.values).toEqual([]);
    });
  });

  describe("Limit and Offset", () => {
    it("should build correct SQL for limit", () => {
      const result = builder.limit(10).build();

      expect(result.sql).toContain("LIMIT 10");
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for offset", () => {
      const result = builder.offset(20).build();

      expect(result.sql).toContain("OFFSET 20");
      expect(result.values).toEqual([]);
    });

    it("should build correct SQL for limit and offset", () => {
      const result = builder.limit(10).offset(20).build();

      expect(result.sql).toContain("LIMIT 10");
      expect(result.sql).toContain("OFFSET 20");
      expect(result.values).toEqual([]);
    });
  });

  describe("Complex Queries", () => {
    it("should build correct SQL for complex query with all clauses", () => {
      const where: SimpleWhere<User> = {
        key: "age",
        operator: ">",
        value: 18,
      };

      const join: Join<User, Role> = {
        table: "roles",
        type: "inner",
        on: {
          localField: "roleId",
          foreignField: "id",
        },
      };

      const orderBy: OrderBy<User> = {
        key: "name",
        direction: "asc",
      };

      const result = builder
        .select(["name", "email"])
        .where(where)
        .join(join)
        .orderBy(orderBy)
        .limit(10)
        .offset(20)
        .build();

      expect(result.sql).toContain(`SELECT "users"."name","users"."email"`);
      expect(result.sql).toContain(`FROM "users"`);
      expect(result.sql).toContain(
        `INNER JOIN "roles" AS "roles" ON "roles"."id" = "users"."roleId"`,
      );
      expect(result.sql).toContain(`WHERE "users"."age" > $1`);
      expect(result.sql).toContain(`ORDER BY "users"."name" ASC NULLS FIRST`);
      expect(result.sql).toContain("LIMIT 10");
      expect(result.sql).toContain("OFFSET 20");
      expect(result.values).toEqual([18]);
    });
  });
});
