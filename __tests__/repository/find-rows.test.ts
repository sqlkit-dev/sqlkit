import {Repository} from "../../src/repository/repository";
import {between, eq, gt, gte, ilike, iregexp, isNotNull, isNull, like, lt, lte, neq, regexp,} from "../../src";
import {cleanupTestData, DomainUser, executor, setupTestTables,} from "../../test-setup";
import {faker} from "@faker-js/faker";

describe("Repository findRows", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
  });

  beforeEach(async () => {
    repository = new Repository("users", executor);
    await cleanupTestData();
  });

  // Helper function to create test users
  const createTestUsers = async (count: number) => {
    const users = Array.from({ length: count }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      bio: faker.helpers.arrayElement([faker.lorem.sentence(), null]),
    }));

    const values = users.flatMap((user) => [
      user.name,
      user.email,
      user.age,
      user.bio,
    ]);

    const placeholders = users
      .map(
        (_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
      )
      .join(", ");

    await executor.executeSQL(
      `INSERT INTO users (name, email, age, bio) VALUES ${placeholders} RETURNING *`,
      values
    );

    return users;
  };

  describe("Comparison Operators", () => {
    it("should find rows with eq operator", async () => {
      const users = await createTestUsers(5);
      const targetUser = users[0];

      const result = await repository.findRows({
        where: eq("email", targetUser.email),
      });

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe(targetUser.email);
    });

    it("should find rows with neq operator", async () => {
      const users = await createTestUsers(5);
      const targetUser = users[0];

      const result = await repository.findRows({
        where: neq("email", targetUser.email),
      });

      expect(result).toHaveLength(4);
      expect(result.every((user) => user.email !== targetUser.email)).toBe(
          true
      );
    });

    it("should find rows with gt operator", async () => {
      await createTestUsers(3);
      const minAge = 30;

      const result = await repository.findRows({
        where: gt("age", minAge),
      });

      expect(result.every((user) => user.age! > minAge)).toBe(true);
    });

    it("should find rows with gte operator", async () => {
      await createTestUsers(3);
      const minAge = 30;

      const result = await repository.findRows({
        where: gte("age", minAge),
      });

      expect(result.every((user) => user.age! >= minAge)).toBe(true);
    });

    it("should find rows with lt operator", async () => {
      await createTestUsers(3);
      const maxAge = 40;

      const result = await repository.findRows({
        where: lt("age", maxAge),
      });

      expect(result.every((user) => user.age! < maxAge)).toBe(true);
    });

    it("should find rows with lte operator", async () => {
      const users = await createTestUsers(3);
      const maxAge = 40;

      const result = await repository.findRows({
        where: lte("age", maxAge),
      });

      expect(result.every((user) => user.age! <= maxAge)).toBe(true);
    });

    it("should find rows with like operator", async () => {
      const users = await createTestUsers(3);
      const searchTerm = "john";

      const result = await repository.findRows({
        where: like("name", `%${searchTerm}%`),
      });

      expect(
          result.every((user) => user.name.toLowerCase().includes(searchTerm))
      ).toBe(true);
    });

    it("should find rows with ilike operator", async () => {
      const users = await createTestUsers(3);
      const searchTerm = "JOHN";

      const result = await repository.findRows({
        where: ilike("name", `%${searchTerm}%`),
      });

      expect(
          result.every((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ).toBe(true);
    });

    // TODO: write test for inArray operator
    // TODO: write test for notInArray operator

    it("should find rows with isNull operator", async () => {
      await createTestUsers(3);

      const result = await repository.findRows({
        where: isNull("bio"),
      });

      expect(result.every((user) => user.bio === null)).toBe(true);
    });

    it("should find rows with isNotNull operator", async () => {
      await createTestUsers(3);

      const result = await repository.findRows({
        where: isNotNull("bio"),
      });

      expect(result.every((user) => user.bio !== null)).toBe(true);
    });

    it("should find rows with between operator", async () => {
      await createTestUsers(3);
      const minAge = 25;
      const maxAge = 35;

      const result = await repository.findRows({
        where: between("age", minAge, maxAge),
      });

      expect(
          result.every((user) => user.age! >= minAge && user.age! <= maxAge)
      ).toBe(true);
    });

    it("should find rows with regexp operator", async () => {
      const users = await createTestUsers(3);
      const pattern = "^[A-Z]"; // Names starting with uppercase letter

      const result = await repository.findRows({
        where: regexp("name", pattern),
      });

      expect(result.every((user) => /^[A-Z]/.test(user.name))).toBe(true);
    });

    it("should find rows with iregexp operator", async () => {
      const users = await createTestUsers(3);
      const pattern = "^[a-z]"; // Names starting with any letter (case insensitive)

      const result = await repository.findRows({
        where: iregexp("name", pattern),
      });

      expect(result.every((user) => /^[a-z]/i.test(user.name))).toBe(true);
    });
  });

  describe("Logical Operators", () => {
  //   it("should find rows with and operator", async () => {
  //     const users = await createTestUsers(3);
  //     const minAge = 25;
  //     const role = "admin";
  //
  //     const result = await repository.findRows({
  //       where: and(gt("age", minAge), eq("role", role)),
  //     });
  //
  //     expect(
  //       result.every((user) => user.age! > minAge && user.role === role)
  //     ).toBe(true);
  //   });
  //
  //   it("should find rows with or operator", async () => {
  //     const users = await createTestUsers(3);
  //     const minAge = 30;
  //     const role = "admin";
  //
  //     const result = await repository.findRows({
  //       where: or(gt("age", minAge), eq("role", role)),
  //     });
  //
  //     expect(
  //       result.some((user) => user.age! > minAge || user.role === role)
  //     ).toBe(true);
  //   });
  //
  //   it("should find rows with not operator", async () => {
  //     const users = await createTestUsers(3);
  //     const role = "admin";
  //
  //     const result = await repository.findRows({
  //       where: not(eq("role", role)),
  //     });
  //
  //     expect(result.every((user) => user.role !== role)).toBe(true);
  //   });
  //
  //   it("should find rows with xor operator", async () => {
  //     const users = await createTestUsers(3);
  //     const minAge = 30;
  //     const role = "admin";
  //
  //     const result = await repository.findRows({
  //       where: xor(gt("age", minAge), eq("role", role)),
  //     });
  //
  //     expect(
  //       result.every(
  //         (user) =>
  //           (user.age! > minAge && user.role !== role) ||
  //           (user.age! <= minAge && user.role === role)
  //       )
  //     ).toBe(true);
  //   });
  });
  //
  // describe("Sorting Operators", () => {
  //   it("should sort rows with asc operator", async () => {
  //     const users = await createTestUsers(3);
  //
  //     const result = await repository.findRows({
  //       orderBy: [asc("age")],
  //     });
  //
  //     expect(result).toHaveLength(3);
  //     for (let i = 0; i < result.length - 1; i++) {
  //       expect(result[i].age).toBeLessThanOrEqual(result[i + 1].age!);
  //     }
  //   });
  //
  //   it("should sort rows with desc operator", async () => {
  //     const users = await createTestUsers(3);
  //
  //     const result = await repository.findRows({
  //       orderBy: [desc("age")],
  //     });
  //
  //     expect(result).toHaveLength(3);
  //     for (let i = 0; i < result.length - 1; i++) {
  //       expect(result[i].age).toBeGreaterThanOrEqual(result[i + 1].age!);
  //     }
  //   });
  //
  //   it("should sort rows with nullsFirst operator", async () => {
  //     const users = await createTestUsers(3);
  //
  //     const result = await repository.findRows({
  //       orderBy: [nullsFirst("bio")],
  //     });
  //
  //     expect(result).toHaveLength(3);
  //     const firstNonNullIndex = result.findIndex((user) => user.bio !== null);
  //     if (firstNonNullIndex > 0) {
  //       expect(
  //         result.slice(0, firstNonNullIndex).every((user) => user.bio === null)
  //       ).toBe(true);
  //     }
  //   });
  //
  //   it("should sort rows with nullsLast operator", async () => {
  //     const users = await createTestUsers(3);
  //
  //     const result = await repository.findRows({
  //       orderBy: [nullsLast("bio")],
  //     });
  //
  //     expect(result).toHaveLength(3);
  //     const lastNonNullIndex =
  //       result.length -
  //       1 -
  //       [...result].reverse().findIndex((user) => user.bio !== null);
  //     if (lastNonNullIndex < result.length - 1) {
  //       expect(
  //         result.slice(lastNonNullIndex + 1).every((user) => user.bio === null)
  //       ).toBe(true);
  //     }
  //   });
  // });
  //
  // describe("Complex Queries", () => {
  //   it("should handle complex nested conditions", async () => {
  //     const users = await createTestUsers(5);
  //     const minAge = 25;
  //     const maxAge = 40;
  //     const role = "admin";
  //
  //     const result = await repository.findRows({
  //       where: and(
  //         between("age", minAge, maxAge),
  //         or(eq("role", role), like("name", "%John%"))
  //       ),
  //       orderBy: [desc("age"), asc("name")],
  //       limit: 2,
  //     });
  //
  //     expect(result).toHaveLength(2);
  //     expect(
  //       result.every(
  //         (user) =>
  //           user.age! >= minAge &&
  //           user.age! <= maxAge &&
  //           (user.role === role || user.name.includes("John"))
  //       )
  //     ).toBe(true);
  //   });
  // });
});
