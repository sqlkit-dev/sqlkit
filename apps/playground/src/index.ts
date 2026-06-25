// @ts-nocheck
import { asc, gt, Repository } from "sqlkit";
import { executor } from "./setup";

async function main() {
  console.log("sqlkit playground — connecting to PostgreSQL…\n");

  const userRoleRepo = new Repository("identity__userRoles", executor, {
    logging: true,
  });

  const data = await userRoleRepo.paginate({
    page: 1,
    limit: 10,
    joins: [
      {
        table: "identity__users",
        type: "left",
        columns: ["id", "email"],
        on: {
          localField: "user_id",
          foreignField: "id",
        },
        as: "user",
      },
      {
        table: "identity__roles",
        type: "left",
        columns: ["id", "name"],
        on: {
          localField: "role_id",
          foreignField: "id",
        },
        as: "role",
      },
    ],
  });

  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
