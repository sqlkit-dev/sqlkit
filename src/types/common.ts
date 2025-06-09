export interface QueryResult<T = any> {
  rows: T[];
  rowCount?: number;
}

export interface SqlExecutor<T = any> {
  executeSQL(sql: string, values: T[]): Promise<QueryResult<T>>;
}
