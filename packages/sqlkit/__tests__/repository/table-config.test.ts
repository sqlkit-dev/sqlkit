import { eq, Repository } from "../../src";
import type { SqlExecutor } from "../../src";

describe("Repository table config", () => {
  const executedSql: string[] = [];

  const executor: SqlExecutor = {
    executeSQL: jest.fn(async (sql: string) => {
      executedSql.push(sql);
      if (sql.includes("COUNT(*)")) {
        return { rows: [{ count: "0" }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }),
  };

  beforeEach(() => {
    executedSql.length = 0;
    jest.clearAllMocks();
  });

  it("uses tableName for reads and mutableTableName for writes", async () => {
    const repository = new Repository<{ id: string; name: string }>({
      tableName: "inventory__v_items",
      mutableTableName: "inventory_items",
      executor,
    });

    await repository.find({ where: eq("id", "1") });
    await repository.count(eq("id", "1"));
    await repository.insert({ name: "Widget" });
    await repository.update({
      where: eq("id", "1"),
      data: { name: "Updated" },
    });
    await repository.delete({ where: eq("id", "1") });

    const readSql = executedSql.filter(
      (sql) =>
        sql.includes("inventory__v_items") && !sql.includes("inventory_items")
    );
    const writeSql = executedSql.filter((sql) =>
      sql.includes("inventory_items")
    );

    expect(readSql.length).toBeGreaterThanOrEqual(2);
    expect(writeSql).toHaveLength(3);
    writeSql.forEach((sql) => {
      expect(sql).not.toContain("inventory__v_items");
    });
  });

  it("uses tableName for all operations when mutableTableName is omitted", async () => {
    const repository = new Repository<{ id: string }>({
      tableName: "users",
      executor,
    });

    await repository.find();
    await repository.insert({ id: "1" });

    executedSql.forEach((sql) => {
      expect(sql).toContain('"users"');
    });
  });
});
