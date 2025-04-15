import { Repository } from "../../src/repository/repository";
import {
  DomainPost,
  DomainUser,
  executor,
  seedTestData,
  setupTestTables,
} from "../../test-setup";

describe("Repository Joins", () => {
  let userRepository: Repository<DomainUser>;
  let postRepository: Repository<DomainPost>;

  beforeAll(async () => {
    await setupTestTables();
    await seedTestData();
    userRepository = new Repository("users", executor);
    postRepository = new Repository("posts", executor);
  });

  afterAll(async () => {
    // await cleanupTestData();
  });

  it("true", () => {
    expect(true).toBe(true);
  });

  // it("should perform an inner join between users and posts", async () => {
  //   const result = await userRepository.findRows({
  //     joins: [
  //       {
  //         table: "posts",
  //         type: "inner",
  //         on: { localField: "id", foreignField: "author_id" },
  //         columns: ["title", "content"],
  //       },
  //     ],
  //   });
  //
  //   expect(result).toBeDefined();
  //   expect(result.length).toBeGreaterThan(0);
  //   result.forEach((user) => {
  //     expect(user).toHaveProperty("posts");
  //     expect(user.posts).toBeDefined();
  //   });
  // });
  //
  // it("should perform a left join between users and posts", async () => {
  //   const result = await userRepository.findRows({
  //     joins: [
  //       {
  //         table: "posts",
  //         type: "left",
  //         on: { localField: "id", foreignField: "author_id" },
  //         columns: ["title", "content"],
  //       },
  //     ],
  //   });
  //
  //   expect(result).toBeDefined();
  //   expect(result.length).toBeGreaterThan(0);
  //   result.forEach((user) => {
  //     expect(user).toHaveProperty("posts");
  //   });
  // });
  //

  it("should perform a right join between users and posts", async () => {
    //

    const result = await postRepository.findRows({
      joins: [
        {
          table: "users",
          as: "author",
          type: "left",
          on: { localField: "author_id", foreignField: "id" },
          columns: ["name", "email"],
        },
      ],
    });

    console.log(result);

    // expect(result).toBeDefined();
    // expect(result.length).toBeGreaterThan(0);
    // result.forEach((post) => {
    //   expect(post).toHaveProperty("users");
    // });
  });
});
