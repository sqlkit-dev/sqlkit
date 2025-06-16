import { eq, gt, Repository } from "../../src";
import {
  cleanupMySQLTestData,
  closeMySQLConnection,
  DomainUser,
  mysqlExecutor,
  seedMySQLTestData,
  setupMySQLTestTables
} from "../test-setups/mysql-test-setup";

describe("MySQL Repository", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupMySQLTestTables();
    await seedMySQLTestData();
    repository = new Repository("users", mysqlExecutor);
  });

  afterAll(async () => {
    await cleanupMySQLTestData();
    await closeMySQLConnection();
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
        id: "test-mysql-user-1",
        name: "MySQL Test User",
        email: "mysql-test@example.com",
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
      const result = await repository.update({
        where: eq("email", "mysql-test@example.com"),
        data: { name: "Updated MySQL User" }
      });

      expect(result.rowCount).toBe(1);

      // Verify the update
      const updatedUser = await repository.find({
        where: eq("email", "mysql-test@example.com")
      });
      expect(updatedUser[0].name).toBe("Updated MySQL User");
    });

    it("should delete a user", async () => {
      const result = await repository.delete({
        where: eq("email", "mysql-test@example.com")
      });

      expect(result.rowCount).toBe(1);

      // Verify the deletion
      const deletedUser = await repository.find({
        where: eq("email", "mysql-test@example.com")
      });
      expect(deletedUser.length).toBe(0);
    });
  });
});
