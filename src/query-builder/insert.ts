import { SqlExecutor } from "../types";
import { toSnakeCase } from "../utils";
import { BaseQueryBuilder } from "./base";

export class InsertQueryBuilder<T> extends BaseQueryBuilder<T> {
  private data: Partial<T> | Partial<T>[] = {};
  private returningColumns: Array<keyof T> = ["*"] as any;

  constructor(tableName: string, executor: SqlExecutor) {
    super(tableName, executor);
  }

  values(data: Partial<T> | Partial<T>[]): this {
    this.data = data;
    return this;
  }

  returning(columns?: Array<keyof T>): this {
    if (columns && columns.length > 0) {
      this.returningColumns = columns;
    }
    return this;
  }

  build(): { sql: string; values: any[] } {
    if (Array.isArray(this.data)) {
      // Handle bulk insert
      return this.buildBulkInsert();
    } else {
      // Handle single insert
      return this.buildSingleInsert();
    }
  }

  private buildSingleInsert(): { sql: string; values: any[] } {
    const data = this.data as Partial<T>;
    const columns = Object.keys(data)
      .map(toSnakeCase)
      .map((c) => `"${c}"`)
      .join(", ");
    const placeholders = Object.keys(data)
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const values = Object.values(data);

    const returning = this.returningColumns
      .map((col) => (typeof col === "string" ? col : "*"))
      .join(", ");

    const sql = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING ${returning};
    `;

    return { sql, values };
  }

  private buildBulkInsert(): { sql: string; values: any[] } {
    const dataArray = this.data as Partial<T>[];
    if (dataArray.length === 0) {
      throw new Error("No data provided for bulk insert");
    }

    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    dataArray.forEach((data) => {
      Object.keys(data).forEach((key) => allKeys.add(key));
    });

    const columns = Array.from(allKeys).map(toSnakeCase);
    const values: any[] = [];

    // Build value placeholders for each row
    const valuePlaceholders = dataArray
      .map((data, rowIndex) => {
        const rowPlaceholders = columns.map((column, colIndex) => {
          const originalKey = Array.from(allKeys)[colIndex];
          const value = (data as any)[originalKey];
          values.push(value !== undefined ? value : null);
          return `$${values.length}`;
        });
        return `(${rowPlaceholders.join(", ")})`;
      })
      .join(", ");

    const returning = this.returningColumns
      .map((col) => (typeof col === "string" ? col : "*"))
      .join(", ");

    const sql = `
      INSERT INTO ${this.tableName} (${columns.join(", ")})
      VALUES ${valuePlaceholders}
      RETURNING ${returning};
    `;

    return { sql, values };
  }
}
