import { Join, OrderBy, SimpleWhere, WhereCondition } from "../types";
import { toSnakeCase } from "./formatting";

/**
 * Builds a WHERE clause for SQL queries
 */
export const buildWhereClause = <T>(
  where: WhereCondition<T> | undefined,
  tableName: string
): { whereClause: string; values: any[] } => {
  // If no where clause is provided, return empty
  if (!where) {
    return { whereClause: "", values: [] };
  }

  const values: any[] = [];

  // Process the where condition
  const whereClause = processWhereCondition(where, values, tableName);

  return {
    whereClause,
    values
  };
};

/**
 * Process a where condition recursively
 */
const processWhereCondition = <T>(
  where: WhereCondition<T>,
  values: any[],
  tableName: string
): string => {
  // Handle composite conditions (AND/OR)
  if (typeof where === "object") {
    if ("AND" in where && Array.isArray(where.AND) && where.AND.length > 0) {
      const conditions = where.AND.map((condition) =>
        processWhereCondition(condition, values, tableName)
      ).filter(Boolean);

      if (conditions.length === 0) return "";
      if (conditions.length === 1) return conditions[0];

      return `(${conditions.join(" AND ")})`;
    }

    if ("OR" in where && Array.isArray(where.OR) && where.OR.length > 0) {
      const conditions = where.OR.map((condition) =>
        processWhereCondition(condition, values, tableName)
      ).filter(Boolean);

      if (conditions.length === 0) return "";
      if (conditions.length === 1) return conditions[0];

      return `(${conditions.join(" OR ")})`;
    }

    // Handle simple conditions
    if ("key" in where && "operator" in where) {
      return processSimpleCondition(where as SimpleWhere<T>, values, tableName);
    }
  }

  return "";
};

/**
 * Process a simple condition
 */
const processSimpleCondition = <T>(
  condition: SimpleWhere<T>,
  values: any[],
  tableName: string
): string => {
  const { key, operator, value } = condition;

  if (!key) return ""; // Skip if key is missing

  if (operator === "between" && Array.isArray(value)) {
    const [min, max] = value;
    return `"${tableName}"."${key.toString()}" between ${min} AND ${max}`;
  }

  // Handle arrays for IN and NOT IN operators
  if ((operator === "in" || operator === "not in") && Array.isArray(value)) {
    if (value.length === 0) {
      return operator === "in" ? "FALSE" : "TRUE";
    }

    const placeholders = value
      .map((_, i) => `$${values.length + i + 1}`)
      .join(", ");
    value.forEach((v) => values.push(v));

    return `"${tableName}"."${key.toString()}" ${operator} (${placeholders})`;
  }

  // Handle NULL values
  if (value === null) {
    return operator === "="
      ? `"${tableName}"."${key.toString()}" IS NULL`
      : operator === "<>"
        ? `"${tableName}"."${key.toString()}" IS NOT NULL`
        : `"${tableName}"."${key.toString()}" IS NULL`;
  }

  // Standard case with non-null value
  values.push(value);
  return `"${tableName}"."${key.toString()}" ${operator} $${values.length}`;
};

/**
 * Builds an ORDER BY clause for SQL queries
 */
export const buildOrderByClause = <T>(
  orderBy?: Array<OrderBy<T>>,
  baseTableName?: string
): string => {
  if (!orderBy || orderBy.length === 0) {
    return ""; // No order by clause
  }

  const orderByConditions = orderBy.map(({ key, direction }) => {
    // Convert column name to snake_case for database compatibility
    const snakeCaseColumn = toSnakeCase(key.toString());

    // Escape column name to prevent SQL injection
    const safeColumn = `"${snakeCaseColumn}"`;

    // Validate and normalize order direction
    const safeDirection = direction?.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Add NULLS LAST for better sorting behavior
    const nullsOrder = safeDirection === "DESC" ? "NULLS LAST" : "NULLS FIRST";

    return `"${baseTableName}".${safeColumn} ${safeDirection} ${nullsOrder}`;
  });

  return `ORDER BY ${orderByConditions.join(", ")}`;
};

/**
 * Builds JOIN clauses for SQL queries
 */
export const buildJoinClause = <T>(
  joins?: Array<Join<T, any>>,
  baseTableName?: string
): { joinConditionClause: string; joinSelectClause: string[] } => {
  if (!joins || joins.length === 0) {
    return {
      joinConditionClause: "",
      joinSelectClause: []
    };
  }

  const joinConditions = joins.map((join) => {
    const joinType = join.type.toUpperCase();
    const alias = join.as || join.table;
    const foreignField = join.on.foreignField as any;
    const localField = join.on.localField as any;
    return `${joinType} JOIN "${join.table}" AS "${alias}" ON "${alias}"."${foreignField}" = "${baseTableName}"."${localField}"`;
  });

  const joinSelectClause = joins
    .map((join) => {
      if (!join.columns || join.columns.length === 0) return "";

      const alias = join.as || join.table;
      const jsonColumns = join.columns
        .map((col) => `'${col.toString()}', "${alias}"."${col.toString()}"`)
        .join(", ");

      return `json_build_object(${jsonColumns}) AS ${alias}`;
    })
    .filter(Boolean);

  return {
    joinConditionClause: joinConditions.join(" "),
    joinSelectClause
  };
};

/**
 * Builds a SET clause for UPDATE SQL statements with proper type handling
 */
export const buildSetClause = <T>(
  data: Partial<T>,
  startValues: any[] = []
): { setClause: string; values: any[] } => {
  if (!data || Object.keys(data).length === 0) {
    return { setClause: "", values: startValues };
  }

  const values = [...startValues];
  const setClauses: string[] = [];

  Object.entries(data).forEach(([key, value]) => {
    // Convert key to snake_case for database compatibility
    const snakeCaseKey = toSnakeCase(key);

    // Use parameterized queries for values
    const paramIndex = values.length + 1;
    setClauses.push(`"${snakeCaseKey}" = $${paramIndex}`);
    values.push(value);
  });

  return {
    setClause: setClauses.join(", "),
    values
  };
};
