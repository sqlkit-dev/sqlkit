import { SqlExecutor } from "../types/common";

export abstract class BaseQueryBuilder<T> {
  constructor(
    protected readonly tableName: string,
    protected readonly executor: SqlExecutor
  ) {}

  protected abstract build(): { sql: string; values: any[] };

  async execute(): Promise<any> {
    const { sql, values } = this.build();
    return this.executor.executeSQL(sql, values);
  }
}
