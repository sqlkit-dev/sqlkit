import {
  between,
  gt,
  gte,
  ilike,
  inArray,
  iregexp,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  neq,
  notInArray,
  regexp,
  Repository
} from "../../src";
import {
  cleanupTestData,
  DomainUser,
  executor,
  setupTestTables
} from "../../test-setup";

describe("Repository findRows", () => {
  let repository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
    repository = new Repository("users", executor);
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe("Comparison Operators", () => {
    it("should find rows with neq operator", async () => {
      const result = await repository.find({
        where: neq("email", "test-not-exists@example.com")
      });

      expect(result.every((user) => user.email !== "test@example.com")).toBe(
        true
      );
    });

    it("should find rows with gt operator", async () => {
      const result = await repository.find({
        where: gt("age", 30)
      });

      expect(result.every((user) => user.age! > 30)).toBe(true);
    });

    it("should find rows with gte operator", async () => {
      const result = await repository.find({
        where: gte("age", 30)
      });

      expect(result.every((user) => user.age! >= 30)).toBe(true);
    });

    it("should find rows with lt operator", async () => {
      const result = await repository.find({
        where: lt("age", 40)
      });

      expect(result.every((user) => user.age! < 40)).toBe(true);
    });

    it("should find rows with lte operator", async () => {
      const result = await repository.find({
        where: lte("age", 40)
      });

      expect(result.every((user) => user.age! <= 40)).toBe(true);
    });

    it("should find rows with like operator", async () => {
      const result = await repository.find({
        where: like("name", "%john%")
      });

      expect(
        result.every((user) => user.name.toLowerCase().includes("john"))
      ).toBe(true);
    });

    it("should find rows with ilike operator", async () => {
      const result = await repository.find({
        where: ilike("name", "%JOHN%")
      });

      expect(
        result.every((user) => user.name.toLowerCase().includes("john"))
      ).toBe(true);
    });

    it("should find rows with inArray operator", async () => {
      const result = await repository.find({
        where: inArray("email", ["test1@example.com", "test2@example.com"])
      });

      expect(
        result.every((user) =>
          ["test1@example.com", "test2@example.com"].includes(user.email)
        )
      ).toBe(true);
    });

    it("should find rows with notInArray operator", async () => {
      const result = await repository.find({
        where: notInArray("email", ["test1@example.com", "test2@example.com"])
      });

      expect(
        result.every(
          (user) =>
            !["test1@example.com", "test2@example.com"].includes(user.email)
        )
      ).toBe(true);
    });

    it("should find rows with isNull operator", async () => {
      const result = await repository.find({
        where: isNull("bio")
      });

      expect(result.every((user) => user.bio === null)).toBe(true);
    });

    it("should find rows with isNotNull operator", async () => {
      const result = await repository.find({
        where: isNotNull("bio")
      });

      expect(result.every((user) => user.bio !== null)).toBe(true);
    });

    it("should find rows with between operator", async () => {
      const result = await repository.find({
        where: between("age", 25, 35)
      });

      expect(result.every((user) => user.age! >= 25 && user.age! <= 35)).toBe(
        true
      );
    });

    it("should find rows with regexp operator", async () => {
      const result = await repository.find({
        where: regexp("name", "^[A-Z]")
      });

      expect(result.every((user) => /^[A-Z]/.test(user.name))).toBe(true);
    });

    it("should find rows with iregexp operator", async () => {
      const result = await repository.find({
        where: iregexp("name", "^[a-z]")
      });

      expect(result.every((user) => /^[a-z]/i.test(user.name))).toBe(true);
    });
  });
});
