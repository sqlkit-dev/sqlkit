import { QueryResult, SqlExecutor } from "../types";

export abstract class BaseQueryBuilder<T> {
  protected constructor(
    protected readonly tableName: string,
    protected readonly executor: SqlExecutor,
  ) {}

  protected abstract build(): { sql: string; values: any[] };

  async commit(): Promise<QueryResult> {
    const { sql, values } = this.build();
    return this.executor.executeSQL(sql, values);
  }
}
