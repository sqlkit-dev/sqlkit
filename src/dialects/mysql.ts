import { QueryResult, SqlExecutor } from "../types";
import { SQLKITException } from "../exceptions";

export class MySQLAdapter implements SqlExecutor {
  constructor(private mysqlConnection: any) {}

  async executeSQL<T>(sql: string, values: any[]): Promise<QueryResult<T>> {
    return new Promise((resolve, reject) => {
      // Handle different MySQL library interfaces
      if (this.mysqlConnection.query) {
        // mysql2 or mysql library
        this.mysqlConnection.query(sql, values, (err: any, results: any, fields: any) => {
          if (err) {
            reject(new SQLKITException(err.message));
          } else {
            // Handle different result types
            if (Array.isArray(results)) {
              // SELECT queries return array of rows
              resolve({
                rows: results as T[],
                rowCount: results.length
              });
            } else if (results.affectedRows !== undefined) {
              // INSERT/UPDATE/DELETE queries return result object
              resolve({
                rows: results.insertId ? [{ insertId: results.insertId }] as T[] : [],
                rowCount: results.affectedRows
              });
            } else {
              // Fallback for other result types
              resolve({
                rows: [results] as T[],
                rowCount: 1
              });
            }
          }
        });
      } else if (this.mysqlConnection.execute) {
        // mysql2 with prepared statements
        this.mysqlConnection.execute(sql, values, (err: any, results: any, fields: any) => {
          if (err) {
            reject(new SQLKITException(err.message));
          } else {
            if (Array.isArray(results)) {
              resolve({
                rows: results as T[],
                rowCount: results.length
              });
            } else if (results.affectedRows !== undefined) {
              resolve({
                rows: results.insertId ? [{ insertId: results.insertId }] as T[] : [],
                rowCount: results.affectedRows
              });
            } else {
              resolve({
                rows: [results] as T[],
                rowCount: 1
              });
            }
          }
        });
      } else {
        reject(new SQLKITException("Unsupported MySQL database interface"));
      }
    });
  }
}