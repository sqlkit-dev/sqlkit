# sqlkit

**sqlkit** is a lightweight and expressive SQL query builder and repository layer for TypeScript with PostgreSQL support.

---

## 🔧 Installation

```bash
npm install sqlkit
```

## 🚀 Usage Examples

### 1. Query Builder (Build Mode)

```ts
import { SelectQueryBuilder } from "sqlkit";

const builder = new SelectQueryBuilder("users");

const { sql, values } = builder
  .select(["id", "name"])
  .where({ key: "age", operator: ">", value: 18 })
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

const builder = new SelectQueryBuilder("users", executor);

const users = await builder
  .select(["id", "name"])
  .where({ key: "age", operator: ">", value: 18 })
  .commit();

console.log(users);
// => [{ id: "1", name: "John Doe" }, ...]
```

### 3. Repository API 🔥

```ts
import { Repository, gt, like, and } from "sqlkit";
import { PostgresAdapter } from "sqlkit";
import { Pool } from "pg";

const pool = new Pool({
  /* your config */
});
const executor = new PostgresAdapter(pool);
const userRepo = new Repository("users", executor);

// Find many
const users = await userRepo.findRows({
  where: and(gt("age", 25), like("name", "%Doe%")),
});

// Find one
const user = await userRepo.findRow(like("email", "%@example.com"));

// Count
const count = await userRepo.count(gt("age", 30));

// Insert
const newUser = await userRepo.insertOne({
  name: "Rayhan",
  email: "ray@example.com",
});

// Update
const updated = await userRepo.update({ name: "Ray" }, like("email", "%ray%"));

// Delete
const deleted = await userRepo.delete(like("name", "Ray%"));
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
