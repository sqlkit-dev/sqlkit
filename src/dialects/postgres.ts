import { QueryResult, SqlExecutor } from "../types/common";

export class PostgresAdapter implements SqlExecutor {
  constructor(private client: any) {}

  async executeSQL<T>(sql: string, values: any[]): Promise<QueryResult> {
    try {
      const result = await this.client.query(sql, values);
      return { rows: result.rows as T[] };
    } catch (error) {
      throw new Error(`PostgreSQL error: ${(error as Error).message}`);
    }
  }
}
