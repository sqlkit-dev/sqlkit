import { Column } from "./column";

export class Table<T> {
  readonly columns: Column<T>[] = [];

  constructor(public readonly name: string) {}

  column<K extends keyof T>(name: K, type: string): Column<T> {
    const column = new Column<T>(name.toString(), type);
    this.columns.push(column);
    return column;
  }

  toString(): string {
    const columnDefinitions = this.columns
      .map((column) => column.toString())
      .join(",\n  ");

    return `CREATE TABLE ${this.name} (\n  ${columnDefinitions}\n);`;
  }
}
