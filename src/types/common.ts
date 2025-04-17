export interface QueryResult<T = any> {
  rows: T[];
}

export interface SqlExecutor<T = any> {
  executeSQL(sql: string, values: T[]): Promise<QueryResult<T>>;
}
