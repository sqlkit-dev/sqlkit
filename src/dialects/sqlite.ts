import { QueryResult, SqlExecutor } from "../types";
import { SQLKITException } from "../exceptions";

export class SQLiteAdapter implements SqlExecutor {
  constructor(private sqliteDb: any) {}

  async executeSQL<T>(sql: string, values: any[]): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      try {
        if (this.sqliteDb.prepare) {
          // better-sqlite3 prepared statements
          console.log('Original SQL:', sql);
          console.log('Original values:', values);
          // Convert PostgreSQL-style placeholders ($1, $2, etc.) to SQLite-style (?)
          let sqliteQuery = sql.replace(/\$\d+/g, '?');
          
          // Determine if this is a SELECT statement or a modification statement
          const trimmedSql = sql.trim().toUpperCase();
          const isSelectStatement = trimmedSql.startsWith('SELECT') || 
                                  trimmedSql.startsWith('WITH') ||
                                  (trimmedSql.startsWith('PRAGMA') && trimmedSql.includes('=')); // Some PRAGMA statements return data
          
          // SQLite doesn't support RETURNING clause in INSERT, UPDATE, DELETE statements
          // Strip RETURNING clause for modification statements
          if (!isSelectStatement && sqliteQuery.toUpperCase().includes('RETURNING')) {
            sqliteQuery = sqliteQuery.replace(/\s+RETURNING\s+[\s\S]*?;?\s*$/i, ';');
          }
          
          const stmt = this.sqliteDb.prepare(sqliteQuery);
          
          if (isSelectStatement) {
            // Use .all() for SELECT statements
            const rows = stmt.all(values) as T[];
            resolve({
              rows: rows || [],
              rowCount: rows?.length || 0
            });
          } else {
            // Use .run() for INSERT, UPDATE, DELETE, CREATE, DROP, etc.
            const result = stmt.run(values);
            if (sqliteQuery.toUpperCase().includes('UPDATE')) {
              console.log('UPDATE query:', sqliteQuery);
              console.log('UPDATE values:', values);
              console.log('UPDATE result:', result);
            }
            resolve({
              rows: [] as T[],
              rowCount: result.changes || 0
            });
          }
        } else if (this.sqliteDb.all) {
          // node-sqlite3 callback-based API
          this.sqliteDb.all(sql, values, (err: any, rows: T[]) => {
            if (err) {
              reject(new SQLKITException(err.message));
            } else {
              resolve({
                rows: rows || [],
                rowCount: rows?.length || 0
              });
            }
          });
        } else {
          reject(new SQLKITException("Unsupported SQLite database interface"));
        }
      } catch (err: any) {
        reject(new SQLKITException(err.message));
      }
    });
  }
}