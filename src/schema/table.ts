import { Column } from "./column";

export class Table<T> {
  readonly columns: Column[] = [];

  constructor(public readonly name: string) {}

  column<K extends keyof T>(name: K, type: string): Column{
    const column = new Column(name.toString(), type);
    this.columns.push(column);
    return column;
  }

  createTableSql(): string {
    const columnDefinitions = this.columns
      .map((column) => column.toString())
      .join(",\n  ");

    return `CREATE TABLE IF NOT EXISTS ${this.name} (\n  ${columnDefinitions}\n);`;
  }
}
