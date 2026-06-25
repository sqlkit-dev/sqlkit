import type { Pool } from "pg";
import { SQLKITException } from "../exceptions";
import { QueryResult, SqlExecutor } from "../types";

/**
 * Runs parameterized SQL from sqlkit against a `pg` pool.
 * sqlkit generates PostgreSQL-style placeholders (`$1`, `$2`, …).
 */
export class PostgresAdapter implements SqlExecutor {
  constructor(private readonly pgPool: Pool) {}

  async executeSQL<T>(sql: string, values: unknown[]): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      console.log("executing query", {
        sql,
        values
      });

      this.pgPool.query(sql, values as any[], (err, result) => {
        if (err) {
          reject(new SQLKITException(err.message, { cause: err }));
        } else {
          resolve(result as QueryResult<T>);
        }
      });
    });
  }
}
