import {
  SelectQueryBuilder,
  InsertQueryBuilder,
  UpdateQueryBuilder,
  DeleteQueryBuilder
} from "../query-builder";
import {
  PaginatedResult,
  PaginationOptions,
  QueryRowsPayload,
  SqlExecutor,
  WhereCondition
} from "../types";
import { buildWhereClause } from "../utils";

export class Repository<T> {
  constructor(
    protected readonly tableName: string,
    protected readonly executor: SqlExecutor
  ) {}

  async findRow(where: WhereCondition<T>): Promise<T | null> {
    const builder = new SelectQueryBuilder<T>(this.tableName, this.executor);
    const result = await builder.where(where).limit(1).commit();
    return result.rows[0] ?? null;
  }

  async findRows(payload?: QueryRowsPayload<T>): Promise<T[]> {
    const builder = new SelectQueryBuilder<T>(this.tableName, this.executor);
    if (payload?.where) builder.where(payload.where);
    if (payload?.joins) {
      payload.joins.forEach((join) => builder.join(join));
    }
    if (payload?.orderBy) builder.orderBy(payload.orderBy);
    if (payload?.limit) builder.limit(payload.limit);
    if (payload?.offset) builder.offset(payload.offset);
    // console.log(builder.build().sql);
    // console.log(builder.build().values);
    const result = await builder.commit();
    return result.rows;
  }

  /**
   * Paginate the result of a query
   * @param options
   */
  paginate(options: PaginationOptions<T>): Promise<PaginatedResult<T>> {
    const builder = new SelectQueryBuilder<T>(this.tableName, this.executor);
    if (options.where) builder.where(options.where);
    if (options.joins) {
      options.joins.forEach((join) => builder.join(join));
    }
    if (options.orderBy) builder.orderBy(options.orderBy);
    if (options.limit) builder.limit(options.limit);
    if (options.offset) builder.offset(options.offset);
    return builder.paginate(options);
  }

  async count(where: WhereCondition<T>): Promise<number> {
    const { whereClause, values } = buildWhereClause(where, this.tableName);

    // Construct the SQL query
    const query = `
      SELECT COUNT(*) as count
      FROM ${this.tableName}
      ${whereClause ? `WHERE ${whereClause}` : ""};
    `;

    const result = await this.executor.executeSQL(query, values);
    return parseInt(result.rows[0].count, 10);
  }

  async insertOne(
    data: Partial<T>,
    returning: Array<keyof T> = ["*"] as any
  ): Promise<T> {
    const builder = new InsertQueryBuilder<T>(this.tableName, this.executor);
    const result = await builder.values(data).returning(returning).commit();
    return result.rows[0];
  }

  async insertMany(
    data: Partial<T>[],
    returning: Array<keyof T> = ["*"] as any
  ): Promise<T[]> {
    const builder = new InsertQueryBuilder<T>(this.tableName, this.executor);
    const result = await builder.values(data).returning(returning).commit();
    return result.rows;
  }

  async update(args: {
    where: WhereCondition<T>;
    data: Partial<T>;
    returning?: Array<keyof T>;
  }): Promise<T | null> {
    const { where, data, returning = ["*"] as any } = args;

    const builder = new UpdateQueryBuilder<T>(this.tableName, this.executor);
    const result = await builder
      .set(data)
      .where(where)
      .returning(returning)
      .commit();
    return result.rows[0] ?? null;
  }

  async delete(
    arg: {
      where: WhereCondition<T>;
      returning?: Array<keyof T>;
    }
  ): Promise<T | null> {
    const builder = new DeleteQueryBuilder<T>(this.tableName, this.executor);
    const result = await builder.where(arg.where).returning(arg.returning).commit();
    return result.rows[0] ?? null;
  }
}
