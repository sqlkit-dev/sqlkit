export class Column {
  private _nullable: boolean = true;
  private _primaryKey: boolean = false;
  private _generateUUID: boolean = false;
  private _unique: boolean = false;
  private _default?: any;
  private _references?: {
    table: string;
    column: string;
    onDelete?:
      | "CASCADE"
      | "SET NULL"
      | "NO ACTION"
      | "RESTRICT"
      | "SET DEFAULT";
  };

  constructor(
    public readonly name: string,
    public readonly type: string,
  ) {}

  notNull(): this {
    this._nullable = false;
    return this;
  }

  primaryKey(): this {
    this._primaryKey = true;
    this._nullable = false;
    return this;
  }

  unique(): this {
    this._unique = true;
    return this;
  }

  default(value: any): this {
    this._default = value;
    return this;
  }

  $defaultUUID(): this {
    this._generateUUID = true;
    return this;
  }

  $defaultNOW(): this {
    this._default = `now()`;
    return this;
  }

  references({
    table,
    column = "id",
    onDelete,
  }: {
    table: string;
    column?: string;
    onDelete?:
      | "CASCADE"
      | "SET NULL"
      | "NO ACTION"
      | "RESTRICT"
      | "SET DEFAULT";
  }): this {
    this._references = { table, column, onDelete };
    return this;
  }

  toString(): string {
    let definition = `"${this.name}" ${this.type}`;

    if (this._primaryKey) {
      definition += " PRIMARY KEY";
    }

    if (!this._nullable) {
      definition += " NOT NULL";
    }

    if (this._unique) {
      definition += " UNIQUE";
    }

    if (this._default !== undefined) {
      if (typeof this._default === "string") {
        definition += ` DEFAULT '${this._default}'`;
      } else if (this._default === null) {
        definition += " DEFAULT NULL";
      } else {
        definition += ` DEFAULT ${this._default}`;
      }
    }

    if (this._generateUUID) {
      definition += " DEFAULT gen_random_uuid()";
    }

    if (this._references) {
      definition += ` REFERENCES ${this._references.table}(${this._references.column}) ON DELETE ${this._references.onDelete ?? "SET NULL"}`;
    }

    return definition;
  }
}
