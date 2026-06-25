export const varchar = (length: number = 255) => `VARCHAR(${length})`;
export const char = (length: number = 50) => `CHAR(${length})`;
export const decimal = (precision: number, scale: number) =>
  `DECIMAL(${precision}, ${scale})`;

export const uuid = () => "UUID";
export const text = () => "TEXT";
export const integer = () => "INTEGER";
export const serial = () => "SERIAL";
export const boolean = () => "BOOLEAN";
export const timestamp = () => "TIMESTAMP";
export const date = () => "DATE";
export const json = () => "JSON";
export const jsonb = () => "JSONB";
