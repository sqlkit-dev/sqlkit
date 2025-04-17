import { SqlExecutor } from "../types";
import { UpdatePayload, WhereCondition } from "../types";
import { buildSetClause, buildWhereClause } from "../utils";
import { BaseQueryBuilder } from "./base";

export class UpdateQueryBuilder<T> extends BaseQueryBuilder<T> {
  private payload: UpdatePayload<T> = { where: {}, data: {} };

  constructor(tableName: string, executor: SqlExecutor) {
    super(tableName, executor);
  }

  set(data: Partial<T>): this {
    this.payload.data = data;
    return this;
  }

  where(condition: WhereCondition<T>): this {
    this.payload.where = condition;
    return this;
  }

  returning(columns?: Array<keyof T>): this {
    this.payload.returning = columns;
    return this;
  }

  build(): { sql: string; values: any[] } {
    // Build WHERE clause
    const { whereClause, values: whereValues } = buildWhereClause(
      this.payload.where,
      this.tableName,
    );

    // Build SET clause using the where values as starting point
    const { setClause, values: allValues } = buildSetClause(
      this.payload.data,
      whereValues,
    );

    // Handle columns for RETURNING
    const returningColumns = this.payload.returning
      ? this.payload.returning.join(", ")
      : "*";

    // Build final SQL query
    const sql = `
      UPDATE "${this.tableName}"
      SET ${setClause}
      ${whereClause ? `WHERE ${whereClause}` : ""}
      RETURNING ${returningColumns};
    `;

    return { sql, values: allValues };
  }
}
