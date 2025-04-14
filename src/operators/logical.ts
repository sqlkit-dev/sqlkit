import { CompositeWhere, WhereCondition } from "../types";

/**
 * Creates a logical AND condition
 * @param conditions Array of conditions to combine with AND
 * @returns A CompositeWhere condition
 */
export function and<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    AND: conditions,
  };
}

/**
 * Creates a logical OR condition
 * @param conditions Array of conditions to combine with OR
 * @returns A CompositeWhere condition
 */
export function or<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    OR: conditions,
  };
}

/**
 * Creates a logical NOT condition
 * @param condition The condition to negate
 * @returns A CompositeWhere condition
 */
export function not<T>(condition: WhereCondition<T>): CompositeWhere<T> {
  return {
    NOT: condition,
  };
}

/**
 * Creates a logical XOR condition
 * @param conditions Array of conditions to combine with XOR
 * @returns A CompositeWhere condition
 */
export function xor<T>(
  ...conditions: Array<WhereCondition<T>>
): CompositeWhere<T> {
  return {
    XOR: conditions,
  };
}
