import { SimpleWhere } from "../types/query";

// Equal
export function eq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value,
  };
}

// Not equal
export function neq<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value,
  };
}

// Greater than
export function gt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">",
    value,
  };
}

// Greater than or equal
export function gte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: ">=",
    value,
  };
}

// Less than
export function lt<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<",
    value,
  };
}

// Less than or equal
export function lte<T, K extends keyof T>(key: K, value: T[K]): SimpleWhere<T> {
  return {
    key,
    operator: "<=",
    value,
  };
}

// Like (case-sensitive)
export function like<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "like",
    value: pattern,
  };
}

// ILike (case-insensitive)
export function ilike<T>(key: keyof T, pattern: string): SimpleWhere<T> {
  return {
    key,
    operator: "ilike",
    value: pattern,
  };
}

// In list of values
export function inArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "in",
    value: values,
  };
}

// Not in list of values
export function notInArray<T, K extends keyof T>(
  key: K,
  values: T[K][]
): SimpleWhere<T> {
  return {
    key,
    operator: "not in",
    value: values,
  };
}

// Is null
export function isNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "=",
    value: null,
  };
}

// Is not null
export function isNotNull<T>(key: keyof T): SimpleWhere<T> {
  return {
    key,
    operator: "<>",
    value: null,
  };
}
