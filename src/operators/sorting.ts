import { OrderBy } from "../types/query";

// Ascending order
export function asc<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "asc",
  };
}

// Descending order
export function desc<T>(key: keyof T): OrderBy<T> {
  return {
    key,
    direction: "desc",
  };
}
