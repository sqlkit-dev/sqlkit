import { CompositeWhere, WhereCondition } from "../types";

// Logical AND
export function and<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    AND: conditions,
  };
}

// Logical OR
export function or<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    OR: conditions,
  };
}
