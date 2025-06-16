import {
  cleanupTestTables,
  DomainPost,
  DomainUser,
  executor,
  seedTestData,
  setupTestTables
} from "../test-setups/pg-test-setup";
import { asc, desc, Repository } from "../../src";

describe("Repository Pagination", () => {
  let postRepository: Repository<DomainPost>;
  let userRepository: Repository<DomainUser>;

  beforeAll(async () => {
    await setupTestTables();
    await seedTestData();
    postRepository = new Repository<DomainPost>("posts", executor);
    userRepository = new Repository<DomainUser>("users", executor);
  });

  afterAll(async () => {
    await cleanupTestTables();
  });

  it("should paginate posts correctly", async () => {
    const page1 = await postRepository.paginate({ page: 1, limit: 5 });
    const page2 = await postRepository.paginate({ page: 2, limit: 5 });

    expect(page1.nodes).toHaveLength(5);
    expect(page2.nodes).toHaveLength(5);
    expect(page1.nodes[0].id).not.toEqual(page2.nodes[0].id);
  });

  it("should return an empty array if page exceeds total pages", async () => {
    const page = await postRepository.paginate({ page: 100, limit: 5 });
    expect(page.nodes).toHaveLength(0);
  });

  it("should paginate posts correctly without related authors", async () => {
    const page = await postRepository.paginate({
      page: 1,
      limit: 5
    });

    expect(page.nodes).toHaveLength(5);
    page.nodes.forEach((post) => {
      expect(post.author).toBeUndefined();
    });
  });

  it("should sort users by age in ascending order", async () => {
    const page = await userRepository.paginate({
      page: 1,
      limit: 5,
      orderBy: [asc("age")]
    });

    expect(page.nodes).toHaveLength(5);
    for (let i = 1; i < page.nodes.length; i++) {
      expect(page.nodes[i].age).toBeGreaterThanOrEqual(
        page?.nodes?.[i - 1].age ?? 0
      );
    }
  });

  it("should sort users by age in descending order", async () => {
    const page = await userRepository.paginate({
      page: 1,
      limit: 5,
      orderBy: [desc("age")]
    });

    expect(page.nodes).toHaveLength(5);
    for (let i = 1; i < page.nodes.length; i++) {
      expect(page.nodes[i].age ?? 0).toBeLessThanOrEqual(
        page.nodes[i - 1].age ?? 0
      );
    }
  });

  it("Should return all result when limit is -1", async () => {
    const countQuery = await executor.executeSQL<{ count: 0 }>(
      `
      SELECT COUNT(*) as count
      FROM "posts"
    `,
      []
    );

    const page = await postRepository.paginate({
      page: 1,
      limit: -1
    });

    expect(page.meta.totalCount).toBe(+countQuery.rows[0].count);
    expect(page.nodes.length).toBe(+countQuery.rows[0].count);
  });

  it("Should return 10 result when limit is not provided", async () => {
    const page = await postRepository.paginate({
      page: 1
    });

    expect(page.nodes.length).toBe(10);
  });
});
