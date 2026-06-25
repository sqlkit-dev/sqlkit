# Changelog

## 1.0.19 — 2025-06-25

Hotfix: restore published package entry points to `dist/` so TypeScript consumers resolve `SqlExecutor`, `eq`, `PostgresAdapter`, and other exports correctly. v1.0.18 accidentally shipped with `main`/`types` pointing at `src/`.

## 1.0.18 — 2025-06-25

PostgreSQL-focused release with a richer repository API, clearer npm packaging, and a contributor-friendly monorepo layout.

### Features

- **`findOne()`** — fetch a single row by where condition, or pass a full query payload (columns, order, joins) with `limit: 1` applied automatically; returns `null` when nothing matches.
- **Column selection on `find()` and `paginate()`** — pass `columns: ['id', 'email']` to limit selected fields instead of always returning `*`.
- **Flexible `insert()`** — accept one object or an array in a single call; bulk inserts still use one round-trip.
- **Optional `count()` filter** — omit `where` to count all rows in the table.
- **`operationName` in repository logging** — optional label on `find`, `update`, and `delete` log output for easier tracing in development.

### Fixes

- **Quoted table identifiers** — generated SQL now wraps table names in double quotes (`"users"`) everywhere (SELECT, INSERT, UPDATE, DELETE, JOIN, schema DDL, and foreign keys), so mixed-case table names behave correctly in PostgreSQL.
- **`PostgresAdapter` errors** — database errors are thrown as `SQLKITException` with the original driver error attached as `cause` for easier debugging.

### Internal

- Repo restructured as a **Bun workspaces monorepo**: library in `packages/sqlkit`, local **`apps/playground`** for trying the API against PostgreSQL, `docker compose` for a test database, and CI switched to Bun.
- Documentation and package metadata updated to describe sqlkit as a **PostgreSQL** query builder; `pg` is listed as a **peer dependency**.
- Contributor docs (`README.md`, `CLAUDE.md`) updated for the new layout.

**Full changelog:** https://github.com/sqlkit-dev/sqlkit/compare/1.0.12...HEAD
