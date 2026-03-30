# sqlkit

**sqlkit** is a zero-dependency lightweight and expressive SQL query builder and repository layer for TypeScript with PostgreSQL support.

---

## 🔧 Installation

```bash
npm install sqlkit
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

```ts
import { Repository, PostgresAdapter, gt, like, and, asc } from "sqlkit";
import { Pool } from "pg";

const pool = new Pool({
  /* your config */
});
const executor = new PostgresAdapter(pool);
const userRepo = new Repository<User>("users", executor);

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

// Find one (find always returns an array)
const [user] = await userRepo.find({
  where: like("email", "%@example.com"),
  limit: 1,
});

// Count
const count = await userRepo.count(gt("age", 30));

// Insert (accepts an array of rows; returns QueryResult)
const insertResult = await userRepo.insert([
  { name: "Rayhan", email: "ray@example.com" },
]);
// insertResult.rows[0] — inserted row(s)

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
