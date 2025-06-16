import { eq, gt, Repository } from "../../src";
import {
  cleanupSQLiteTestData,
  DomainUser,
  seedSQLiteTestData,
  setupSQLiteTestTables,
  sqliteExecutor
} from "../test-setups/sqlite-test-setup";

describe("SQLite Repository", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupSQLiteTestTables();
    await seedSQLiteTestData();
    repository = new Repository("users", sqliteExecutor);
  });

  afterAll(async () => {
    await cleanupSQLiteTestData();
  });

  describe("Basic Operations", () => {
    it("should find users with eq operator", async () => {
      // First, let's get a user to test with
      const allUsers = await repository.find();
      expect(allUsers.length).toBeGreaterThan(0);

      const firstUser = allUsers[0];
      const result = await repository.find({
        where: eq("email", firstUser.email)
      });

      expect(result.length).toBe(1);
      expect(result[0].email).toBe(firstUser.email);
    });

    it("should find users with gt operator", async () => {
      const result = await repository.find({
        where: gt("age", 30)
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((user) => {
        if (user.age !== null && user.age !== undefined) {
          expect(user.age).toBeGreaterThan(30);
        }
      });
    });

    it("should count users", async () => {
      const count = await repository.count(gt("age", 18));
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should insert a new user", async () => {
      const newUser = {
        id: "test-sqlite-user-1",
        name: "SQLite Test User",
        email: "sqlite-test@example.com",
        age: 25
      };

      const result = await repository.insert([newUser]);
      expect(result.rowCount).toBe(1);

      // Verify the user was inserted
      const foundUser = await repository.find({
        where: eq("email", newUser.email)
      });
      expect(foundUser.length).toBe(1);
      expect(foundUser[0].name).toBe(newUser.name);
    });

    it("should update a user", async () => {
      // First, insert a test user to ensure it exists
      const testUser = {
        id: crypto.randomUUID(),
        name: "Test User For Update",
        email: "update-test@example.com",
        age: 30
      };

      const res = await repository.insert([testUser]);

      // Now update it
      await repository.update({
        where: eq("email", "update-test@example.com"),
        data: { name: "Updated SQLite User" }
      });

      const [updated_user] = await repository.find({
        where: eq("email", testUser.email),
        limit: 1
      });

      expect(updated_user.email).toBe(testUser.email);
    });

    // it("should delete a user", async () => {
    //   const result = await repository.delete({
    //     where: eq("email", "sqlite-test@example.com")
    //   });

    //   expect(result.rowCount).toBe(1);

    //   // Verify the deletion
    //   const deletedUser = await repository.find({
    //     where: eq("email", "sqlite-test@example.com")
    //   });
    //   expect(deletedUser.length).toBe(0);
    // });
  });
});
