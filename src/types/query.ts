export type Operator =
  | "="
  | "<"
  | ">"
  | "<="
  | ">="
  | "<>"
  | "like"
  | "ilike"
  | "in"
  | "not in";

export interface SimpleWhere<T> {
  key: keyof T;
  operator: Operator;
  value: any;
}

export interface CompositeWhere<T> {
  AND?: Array<WhereCondition<T>>;
  OR?: Array<WhereCondition<T>>;
}

export type WhereCondition<T> = SimpleWhere<T> | CompositeWhere<T>;

export interface OrderBy<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

export interface Join<T, F> {
  table: string;
  as?: string;
  type: "inner" | "left" | "right" | "full";
  on: {
    localField: keyof T;
    foreignField: keyof F;
  };
  columns?: Array<keyof F>;
}

export interface QueryPayload<T> {
  where?: WhereCondition<T>;
  joins?: Join<T, any>[];
  orderBy?: Array<OrderBy<T>>;
  columns?: Array<keyof T>;
  limit?: number;
  offset?: number;
}

export interface UpdatePayload<T> {
  where: WhereCondition<T>;
  data: Partial<T>;
  returning?: Array<keyof T>;
}
