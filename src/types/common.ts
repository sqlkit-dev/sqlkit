export interface QueryResult {
  rows: any[];
}

export interface SqlExecutor<T = any> {
  executeSQL(sql: string, values: T[]): Promise<QueryResult>;
}
