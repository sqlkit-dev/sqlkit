import { seedTestData } from "../__tests__/test-setups/pg-test-setup";

async function main() {
  await seedTestData();
}
main();
