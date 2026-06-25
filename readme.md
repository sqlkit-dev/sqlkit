# sqlkit monorepo

Bun workspaces monorepo for [sqlkit](https://github.com/sqlkit-dev/sqlkit) — a zero-dependency TypeScript query builder and repository layer for PostgreSQL.

## Workspace layout

| Path              | Package              | Description                                 |
| ----------------- | -------------------- | ------------------------------------------- |
| `packages/sqlkit` | `sqlkit`             | Library source, tests, and build            |
| `apps/playground` | `@sqlkit/playground` | Local dev app exercising the repository API |

## Quick start

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
bun install

# Run playground (and sqlkit tinker) in mprocs
bun dev
```

Or run the playground alone:

```bash
bun run --filter @sqlkit/playground dev
```

Copy `apps/playground/.env.example` to `apps/playground/.env` if you need non-default database credentials.

## Scripts

| Command          | Description                                   |
| ---------------- | --------------------------------------------- |
| `bun dev`        | mprocs tabbed UI — playground + sqlkit tinker |
| `bun test`       | Run repository integration tests              |
| `bun run build`  | Build `sqlkit` for npm (`dist/`)              |
| `bun run format` | Prettier on library source                    |
| `bun run docs`   | Generate Typedoc into `docs/`                 |

## Publishing

The publishable package lives in `packages/sqlkit`. Release CI builds and publishes from that workspace.

Library usage docs: [packages/sqlkit/README.md](./packages/sqlkit/README.md) · [API docs](https://sqlkit-dev.github.io/sqlkit/)
