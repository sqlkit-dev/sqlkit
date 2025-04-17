import { OrderBy } from "../types";

/**
 * Creates an ascending order condition
 * @param key The column name to sort by
 * @returns An OrderBy condition
 */
export function asc<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "asc"
  };
}

/**
 * Creates a descending order condition
 * @param key The column name to sort by
 * @returns An OrderBy condition
 */
export function desc<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "desc"
  };
}

/**
 * Creates a nulls first order condition
 * @param key The column name to sort by
 * @returns An OrderBy condition
 */
export function nullsFirst<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "asc",
    nulls: "first"
  };
}

/**
 * Creates a nulls last order condition
 * @param key The column name to sort by
 * @returns An OrderBy condition
 */
export function nullsLast<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "desc",
    nulls: "last"
  };
}
