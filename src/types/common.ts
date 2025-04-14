export interface QueryResult {
  rows: any[];
}

export interface SqlExecutor {
  executeSQL(sql: string, values: any[]): Promise<QueryResult>;
}
