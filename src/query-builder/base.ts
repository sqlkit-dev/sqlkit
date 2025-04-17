import { QueryResult, SqlExecutor } from "../types";
import { SQLKITException } from "../exceptions";

export abstract class BaseQueryBuilder<T> {
  constructor(
    protected readonly tableName: string,
    protected readonly executor?: SqlExecutor<T>
  ) {}

  protected abstract build(): { sql: string; values: any[] };

  async commit(): Promise<QueryResult> {
    const { sql, values } = this.build();

    if (!this.executor) {
      throw new SQLKITException(`
        To commit a query, you must provide an executor.
        Please provide an executor when creating the query builder.
      `);
    }

    return this.executor.executeSQL(sql, values);
  }
}
