/**
 * Convert camelCase to snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .replace(/^_/, "")
    .toLowerCase();
}

/**
 * Format a value for safe inclusion in SQL strings (for debugging/logging)
 */
export function formatSqlValue(value: any): string {
  // Handle null and undefined
  if (value === null || value === undefined) {
    return "NULL";
  }

  // Handle numbers
  if (typeof value === "number") {
    // Handle NaN and Infinity
    if (isNaN(value)) return "NULL";
    if (!isFinite(value)) return "NULL";
    return value.toString();
  }

  // Handle booleans
  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  // Handle dates
  if (value instanceof Date) {
    // Format to ISO string and ensure proper SQL timestamp format
    return `'${value
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")}'::timestamp`;
  }

  // Handle strings
  if (typeof value === "string") {
    // Escape single quotes by doubling them (SQL standard)
    const escaped = value.replace(/'/g, "''");
    return `'${escaped}'`;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `'{}'`;
    }

    // Format each array element and join with commas
    const formattedElements = value.map((element) => formatSqlValue(element));
    return `ARRAY[${formattedElements.join(",")}]`;
  }

  // Handle objects (convert to JSONB)
  if (typeof value === "object") {
    try {
      // Safely stringify the object and escape any single quotes
      const jsonStr = JSON.stringify(value).replace(/'/g, "''");
      return `'${jsonStr}'::jsonb`;
    } catch (error) {
      // Fallback if JSON stringification fails
      console.error("Error converting object to JSON:", error);
      return "NULL";
    }
  }

  // Default case - try to convert to string
  try {
    return `'${String(value).replace(/'/g, "''")}'`;
  } catch (error) {
    return "NULL";
  }
}
