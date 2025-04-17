import {
  Join,
  OrderBy,
  PaginatedResult,
  PaginationMeta,
  PaginationOptions,
  QueryRowsPayload,
  WhereCondition,
} from "../types";
import {
  buildJoinClause,
  buildOrderByClause,
  buildWhereClause,
} from "../utils";
import { BaseQueryBuilder } from "./base";

export class SelectQueryBuilder<T> extends BaseQueryBuilder<T> {
  private payload: QueryRowsPayload<T> = {};

  select(columns?: Array<keyof T>): this {
    this.payload.columns = columns;
    return this;
  }

  where(condition: WhereCondition<T>): this {
    this.payload.where = condition;
    return this;
  }

  join<F>(join: Join<T, F>): this {
    if (!this.payload.joins) {
      this.payload.joins = [];
    }
    this.payload.joins.push(join);
    return this;
  }

  orderBy(orderBy: OrderBy<T> | Array<OrderBy<T>>): this {
    if (!this.payload.orderBy) {
      this.payload.orderBy = [];
    }

    if (Array.isArray(orderBy)) {
      this.payload.orderBy.push(...orderBy);
    } else {
      this.payload.orderBy.push(orderBy);
    }

    return this;
  }

  limit(limit: number): this {
    this.payload.limit = limit;
    return this;
  }

  offset(offset: number): this {
    this.payload.offset = offset;
    return this;
  }

  build(): { sql: string; values: any[] } {
    // Default columns to '*' if none are provided
    const columns =
      this.payload.columns
        ?.map((col) => `"${this.tableName}"."${col.toString()}"`)
        .join(",") ?? `"${this.tableName}".*`;

    const { whereClause, values } = buildWhereClause(
      this.payload.where,
      this.tableName,
    );

    const orderByClause = buildOrderByClause(
      this.payload.orderBy,
      this.tableName,
    );
    const { joinConditionClause, joinSelectClause } = buildJoinClause(
      this.payload.joins,
      this.tableName,
    );

    // Build the SQL query with LIMIT, OFFSET, and ORDER BY
    const limit = this.payload.limit;
    const offset = this.payload.offset ?? 0;

    const sql = `
      SELECT ${columns}
      ${joinSelectClause.length > 0 ? `,${joinSelectClause.join(",")}` : ""}
      FROM "${this.tableName}"
      ${joinConditionClause ? joinConditionClause : ""}
      ${whereClause ? `WHERE ${whereClause}` : ""}
      ${orderByClause ? orderByClause : ""}
      ${limit ? `LIMIT ${limit}` : ""} ${offset ? `OFFSET ${offset}` : ""};
    `;

    return { sql, values };
  }

  async paginate(options: PaginationOptions<T>): Promise<PaginatedResult<T>> {
    const limit = options.limit || 10;
    const page = options.page || 1;
    const offset = (page - 1) * limit;

    // Set pagination options
    this.limit(limit);
    this.offset(offset);

    // Execute the main query for data
    const result = await this.commit();
    const nodes = result.rows as T[];

    // Execute count query for pagination metadata
    const countBuilder = new SelectQueryBuilder<T>(
      this.tableName,
      this.executor,
    );
    if (options.where) {
      countBuilder.where(options.where);
    }
    if (options.joins) {
      options.joins.forEach((join) => countBuilder.join(join));
    }

    const countSql = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      ${
        buildWhereClause(options.where, this.tableName).whereClause
          ? `WHERE ${buildWhereClause(options.where, this.tableName).whereClause}`
          : ""
      }
    `;

    const countResult = await this.executor.executeSQL(
      countSql,
      buildWhereClause(options.where, this.tableName).values,
    );

    const totalCount = parseInt(countResult.rows[0].count, 10);

    const meta: PaginationMeta = {
      totalCount,
      currentPage: page,
      hasNextPage: page * limit < totalCount,
      totalPages: limit === -1 ? 1 : Math.ceil(totalCount / limit),
    };

    return {
      nodes,
      meta,
    };
  }
}
