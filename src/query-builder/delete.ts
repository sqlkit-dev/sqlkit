import { SqlExecutor } from "../types/common";
import { WhereCondition } from "../types/query";
import { buildWhereClause } from "../utils/clauses";
import { BaseQueryBuilder } from "./base";

export class DeleteQueryBuilder<T> extends BaseQueryBuilder<T> {
  private whereCondition?: WhereCondition<T>;
  private returningColumns: Array<keyof T | "*"> = ["*"] as any;

  constructor(tableName: string, executor: SqlExecutor) {
    super(tableName, executor);
  }

  where(condition: WhereCondition<T>): this {
    this.whereCondition = condition;
    return this;
  }

  returning(columns?: Array<keyof T>): this {
    if (columns && columns.length > 0) {
      this.returningColumns = columns;
    }
    return this;
  }

  build(): { sql: string; values: any[] } {
    const { whereClause, values } = buildWhereClause(
      this.whereCondition,
      this.tableName
    );

    const returning = this.returningColumns.join(", ");

    const sql = `
      DELETE FROM "${this.tableName}"
      ${whereClause ? `WHERE ${whereClause}` : ""}
      RETURNING ${returning};
    `;
    console.log(sql);
    console.log(values);
    return { sql, values };
  }
}
