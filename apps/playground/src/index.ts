import { eq, Repository } from "sqlkit";
import { executor } from "./setup";

export class InventoryItem {
  id: string;

  code: string;

  name: string;

  category: string;

  unit: string;

  usage_type: string;

  reorder_level?: number;

  default_issue_template_id?: string;

  is_active: boolean;

  created_at?: Date;

  updated_at?: Date;

  stock_qty?: number;

  stock_value?: number;
}

async function main() {
  console.log("sqlkit playground — connecting to PostgreSQL…\n");

  const repo = new Repository<InventoryItem>({
    tableName: "inventory__v_items",
    mutableTableName: "inventory__items",
    logging: true,
    executor,
  });

  await repo.update({
    where: eq("id", "8c8ee1d0-a17a-41ec-8399-71064041c400"),
    data: {
      code: "testssss",
    },
  });

  const data = await repo.paginate({
    page: 1,
    limit: 2,
  });

  console.log(JSON.stringify(data, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
