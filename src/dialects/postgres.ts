import { QueryResult, SqlExecutor } from "../types";
import { SQLKITException } from "../exceptions";

export class PostgresAdapter implements SqlExecutor {
  constructor(private pgPool: any) {}

  async executeSQL<T>(sql: string, values: any[]): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.pgPool.query(sql, values, (err, result) => {
        if (err) {
          reject(new SQLKITException(err.message));
        } else {
          resolve(result);
        }
      });
    });
  }
}
