# sqlkit

**sqlkit** is a zero-dependency TypeScript query builder and repository layer **for PostgreSQL**. Install the [`pg`](https://www.npmjs.com/package/pg) driver alongside it when you execute queries.

---

## 🔧 Installation

```bash
npm install sqlkit pg
```

[API Documentation](https://sqlkit-dev.github.io/sqlkit/)

## 🚀 Usage Examples

Define Your Domain Model

```ts
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
}
```

### 1. Query Builder (Build Mode)

```ts
import { SelectQueryBuilder } from "sqlkit";

const builder = new SelectQueryBuilder<User>("users");

const { sql, values } = builder
  .select(["id", "name"])
  .where({ key: "age", operator: ">", value: 18 })
  // OR .where(eq("age", 18))
  .build();

console.log(sql);
// SELECT "users"."id","users"."name" FROM "users" WHERE "users"."age" > $1
console.log(values); // [18]
```

### 2. Query Execution (Commit Mode)

```ts
import { PostgresAdapter, SelectQueryBuilder } from "sqlkit";
import { Pool } from "pg";

const pool = new Pool({
  /* your config */
});
const executor = new PostgresAdapter(pool);

const builder = new SelectQueryBuilder<User>("users", executor);

const { rows: users } = await builder
  .select(["id", "name"])
  .where({ key: "age", operator: ">", value: 18 })
  // OR .where(eq("age", 18))
  .commit();

console.log(users);
// => [{ id: "1", name: "John Doe" }, ...]
```

### 3. Repository API 🔥

`Repository` is configured with a single **`RepositoryConfig`** object:

| Field | Required | Description |
| --- | --- | --- |
| `tableName` | yes | Table or view for **reads** (`find`, `findOne`, `paginate`, `count`) |
| `mutableTableName` | no | Base table for **writes** (`insert`, `update`, `delete`). Defaults to `tableName` |
| `executor` | yes | `SqlExecutor` instance (e.g. `PostgresAdapter`) |
| `logging` | no | Log SQL, values, and row counts to the console |

```ts
import { Repository, PostgresAdapter, gt, like, and, asc } from "sqlkit";
import { Pool } from "pg";

const pool = new Pool({
  /* your config */
});
const executor = new PostgresAdapter(pool);

const userRepo = new Repository<User>({
  tableName: "users",
  executor,
});

// Read from a view, write to the base table
const itemRepo = new Repository<Item>({
  tableName: "inventory__v_items",
  mutableTableName: "inventory_items",
  executor,
  logging: true,
});

// Find many
const users = await userRepo.find({
  where: and(gt("age", 25), like("name", "%Doe%")),
});

// Paginate (offset is derived from page and limit inside paginate)
const result = await userRepo.paginate({
  page: 1,
  limit: 10,
  where: gt("age", 18),
  columns: ["age", "email"],
  orderBy: [asc("age")],
});

console.log(result.nodes); // array of users
console.log(result.meta);
/*
{
  totalCount: 100,
  currentPage: 1,
  totalPages: 10,
  hasNextPage: true
}
*/

// Find one (returns T | null)
const user = await userRepo.findOne(like("email", "%@example.com"));
// Or: findOne({ where: like(...), columns: ["id", "email"], orderBy: [asc("email")] })

// Count (optional filter — omit `where` to count all rows)
const total = await userRepo.count();
const adults = await userRepo.count(gt("age", 30));

// Insert — one object or an array (returns QueryResult)
const one = await userRepo.insert({
  name: "Rayhan",
  email: "ray@example.com",
});
const many = await userRepo.insert([
  { name: "A", email: "a@example.com" },
  { name: "B", email: "b@example.com" },
]);
// one.rows[0], many.rows — inserted rows

// Update
const updated = await userRepo.update({
  data: { name: "Ray" },
  where: like("email", "%ray%"),
});

// Delete
const deleted = await userRepo.delete({
  where: like("name", "Ray%"),
});
```

#### Upgrading from 1.x

The constructor no longer accepts positional `(tableName, executor, options?)`. Use a config object:

```ts
// 1.x
new Repository("users", executor, { logging: true });

// 2.x
new Repository({ tableName: "users", executor, logging: true });
```

### 4. Case-sensitive table names

All generated SQL quotes table and column identifiers (`"users"`, `"inventory__v_items"`), so mixed-case names in PostgreSQL resolve correctly. The `quoteTableName()` helper is exported if you build raw SQL alongside sqlkit.

### 🔍 Supported Operators

**Comparison**

- eq("field", value) – Equal (=)
- neq("field", value) – Not Equal (!=)
- gt("field", value) – Greater Than (>)
- gte("field", value) – Greater Than or Equal (>=)
- lt("field", value) – Less Than (<)
- lte("field", value) – Less Than or Equal (<=)
- between("field", min, max) – BETWEEN
- like("field", pattern) – LIKE
- ilike("field", pattern) – ILIKE (case-insensitive)
- regexp("field", pattern) – REGEXP
- iregexp("field", pattern) – Case-insensitive REGEXP
- inArray("field", [a, b, c]) – IN
- notInArray("field", [a, b]) – NOT IN
- isNull("field") – IS NULL
- isNotNull("field") – IS NOT NULL

**Logical**

- and(...conditions)
- or(...conditions)
- not(condition)
- xor(condA, condB) [⚠️ -- Not tested properly]

**Sorting**

- asc("field")
- desc("field")
- nullsFirst("field")
- nullsLast("field")
