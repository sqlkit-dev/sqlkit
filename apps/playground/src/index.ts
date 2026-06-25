import { asc, gt, Repository } from "sqlkit";
import { executor, seedUsers, setupTables, type User } from "./setup";

async function main() {
  console.log("sqlkit playground — connecting to PostgreSQL…\n");

  await setupTables();
  await seedUsers();

  const userRepo = new Repository<User>("users", executor);

  const adults = await userRepo.find({
    where: gt("age", 20),
    orderBy: [asc("age")],
    columns: ["name", "email", "age"]
  });

  console.log("Users older than 20:");
  console.table(adults);

  const page = await userRepo.paginate({
    page: 1,
    limit: 2,
    orderBy: [asc("name")]
  });

  console.log("\nPaginated (page 1, limit 2):");
  console.table(page.nodes);
  console.log("meta:", page.meta);

  const total = await userRepo.count(gt("age", 25));
  console.log(`\nCount where age > 25: ${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
