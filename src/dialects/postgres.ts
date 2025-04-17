import { QueryResult, SqlExecutor } from "../types/common";

export class PostgresAdapter implements SqlExecutor {
  constructor(private client: any) {}

  async executeSQL<T>(sql: string, values: any[]): Promise<QueryResult> {
    try {
      const result = await this.client.query(sql, values);
      this.client.release();
      return { rows: result.rows as T[] };
    } catch (error) {
      throw new Error(`PostgreSQL error: ${(error as Error).message}`);
    } finally {
      // Ensure the client is released back to the pool
      if (this.client.release) {
        this.client.release();
      }
    }
  }
}
