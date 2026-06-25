# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

| Path | Description |
| --- | --- |
| `packages/sqlkit` | Publishable library (`sqlkit` on npm) |
| `apps/playground` | Local dev app wired to the workspace package |

Root uses Bun workspaces. Run `bun install` at the repo root.

## Commands

```bash
# Start PostgreSQL for tests / playground
docker compose up -d

# Install + run playground (mprocs tabbed UI)
bun install
bun dev

# Build library (outputs CJS + ESM bundles to packages/sqlkit/dist/)
bun run build

# Run all repository tests (requires a running PostgreSQL instance)
bun test

# Run a single test file
cd packages/sqlkit && npx jest __tests__/repository/find.test.ts --runInBand

# Run a specific test by name
cd packages/sqlkit && npx jest __tests__/repository/find.test.ts --runInBand -t "should find rows with gt operator"

# Format source files
bun run format

# Generate docs
bun run docs

# Tinker/scratch file (packages/sqlkit)
cd packages/sqlkit && bun run tinker
```

## Test Database Setup

Tests hit a real PostgreSQL database (no mocks). Configure via environment variables or use defaults:

```
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_NAME=tinyorm_test
TEST_DB_USER=rayhan
TEST_DB_PASSWORD=rayhan123
```

Playground uses `DB_*` env vars (see `apps/playground/.env.example`).

Legacy SQLite/MySQL scratch files under `packages/sqlkit/__tests__/test-setups/*.ts.txt` are not executed.

## Architecture

**sqlkit** is a zero-dependency TypeScript SQL query builder and repository layer **for PostgreSQL** (SQL uses `$1`, `$2`, … and Postgres-specific features such as `json_build_object` for join projections). It has three usage layers:

### 1. Query Builders (`packages/sqlkit/src/query-builder/`)

- `BaseQueryBuilder` — abstract base with `build()` (returns `{sql, values}`) and `commit()` (executes via executor). Each subclass is chainable and stateless until `build()` is called.
- `SelectQueryBuilder` — supports `select`, `where`, `join`, `orderBy`, `limit`, `offset`, `build`, `commit`, and `paginate`
- `InsertQueryBuilder`, `UpdateQueryBuilder`, `DeleteQueryBuilder` — follow the same pattern

### 2. Repository (`packages/sqlkit/src/repository/repository.ts`)

`Repository<T>` wraps the query builders into a higher-level API: `find`, `findOne`, `paginate`, `count` (optional where), `insert` (single object or array), `update`, `delete`.

Constructed with **`RepositoryConfig`**:

```ts
new Repository({
  tableName: "users",           // reads: find, findOne, paginate, count
  mutableTableName: "users",    // writes: insert, update, delete (optional; defaults to tableName)
  executor,
  logging: true,                // optional
});
```

Use `mutableTableName` when reads hit a view (`inventory__v_items`) but mutations target the base table (`inventory_items`).

### 3. Adapter (`packages/sqlkit/src/dialects/postgres.ts`)

- `PostgresAdapter` — wraps a `pg` `Pool`, implements `SqlExecutor` (`executeSQL(sql, values)`).

The `SqlExecutor` interface (`packages/sqlkit/src/types/common.ts`) is the extension point for execution; generated SQL is PostgreSQL-specific.

### Operators (`packages/sqlkit/src/operators/`)

Comparison functions (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `inArray`, `notInArray`, `isNull`, `isNotNull`, `between`, `regexp`, `iregexp`) return `SimpleWhere<T>` objects.

Logical functions (`and`, `or`, `not`) return `CompositeWhere<T>` with `AND`/`OR`/`NOT` arrays, which `buildWhereClause` processes recursively.

### Schema (`packages/sqlkit/src/schema/`)

`Table<T>` and `Column` classes generate `CREATE TABLE IF NOT EXISTS` SQL — used in tests for schema setup, not a migration system.

### SQL Generation (`packages/sqlkit/src/utils/clauses.ts`)

`buildWhereClause`, `buildOrderByClause`, `buildJoinClause`, `buildSetClause` — these utility functions assemble parameterized SQL fragments. All use `$1, $2, ...` positional placeholders (PostgreSQL style). Table names are double-quoted via `quoteTableName()` for case sensitivity. JOIN results are returned as `json_build_object(...)` aliased to the join table/alias name.

### Type System (`packages/sqlkit/src/types/`)

- `WhereCondition<T>` = `SimpleWhere<T> | CompositeWhere<T>` — the core recursive condition type
- `RepositoryConfig` — `tableName`, optional `mutableTableName`, `executor`, optional `logging`
- `QueryRowsPayload<T>` — options bag for `find` (where, joins, orderBy, columns, limit, offset)
- `PaginationOptions<T>` / `PaginatedResult<T>` — for `paginate`, returns `{ nodes, meta }` where `meta` has `totalCount`, `currentPage`, `totalPages`, `hasNextPage`
