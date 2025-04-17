import { SimpleWhere } from "../types";

/**
 * Creates an equality condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function eq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value
  };
}

/**
 * Creates a not equal condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function neq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value
  };
}

/**
 * Creates a greater than condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function gt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">",
    value
  };
}

/**
 * Creates a greater than or equal condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function gte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">=",
    value
  };
}

/**
 * Creates a less than condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function lt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<",
    value
  };
}

/**
 * Creates a less than or equal condition
 * @param key The column name
 * @param value The value to compare against
 * @returns A SimpleWhere condition
 */
export function lte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<=",
    value
  };
}

/**
 * Creates a case-sensitive pattern matching condition
 * @param key The column name
 * @param pattern The pattern to match against
 * @returns A SimpleWhere condition
 */
export function like<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "like",
    value: pattern
  };
}

/**
 * Creates a case-insensitive pattern matching condition
 * @param key The column name
 * @param pattern The pattern to match against
 * @returns A SimpleWhere condition
 */
export function ilike<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "ilike",
    value: pattern
  };
}

/**
 * Creates a condition to check if a value is in a list
 * @param key The column name
 * @param values The list of values to check against
 * @returns A SimpleWhere condition
 */
export function inArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "in",
    value: values
  };
}

/**
 * Creates a condition to check if a value is not in a list
 * @param key The column name
 * @param values The list of values to check against
 * @returns A SimpleWhere condition
 */
export function notInArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "not in",
    value: values
  };
}

/**
 * Creates a condition to check if a value is null
 * @param key The column name
 * @returns A SimpleWhere condition
 */
export function isNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value: null
  };
}

/**
 * Creates a condition to check if a value is not null
 * @param key The column name
 * @returns A SimpleWhere condition
 */
export function isNotNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value: null
  };
}

/**
 * Creates a condition to check if a value is between two values
 * @param key The column name
 * @param min The minimum value
 * @param max The maximum value
 * @returns A SimpleWhere condition
 */
export function between<T, K extends keyof T>(
  key: K,
  min: T[K],
  max: T[K]
): SimpleWhere<T> {
  return {
    key,
    operator: "between",
    value: [min, max]
  };
}

/**
 * Creates a condition to check if a value matches a regular expression
 * @param key The column name
 * @param pattern The regular expression pattern
 * @returns A SimpleWhere condition
 */
export function regexp<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "~",
    value: pattern
  };
}

/**
 * Creates a condition to check if a value matches a case-insensitive regular expression
 * @param key The column name
 * @param pattern The regular expression pattern
 * @returns A SimpleWhere condition
 */
export function iregexp<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "~*",
    value: pattern
  };
}
