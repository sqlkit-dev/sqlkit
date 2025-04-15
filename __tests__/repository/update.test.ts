import {
  cleanupTestTables,
  DomainPost,
  DomainUser,
  executor,
  seedTestData,
  setupTestTables,
} from "../../test-setup";
import { Repository } from "../../src/repository/repository";
import { eq, like } from "../../src";

describe("Repository Update", () => {
  let postRepository: Repository<DomainPost>;
  let userRepository: Repository<DomainUser>;
  let posts: DomainPost[];
  let users: DomainUser[];

  beforeAll(async () => {
    await setupTestTables();
    await seedTestData();
    postRepository = new Repository<DomainPost>("posts", executor);
    userRepository = new Repository<DomainUser>("users", executor);

    const fetchedRows = await Promise.all([
      executor.executeSQL(`SELECT * FROM posts`, []),
      executor.executeSQL(`SELECT * FROM users`, []),
    ]);
    users = fetchedRows[1].rows;
    posts = fetchedRows[0].rows;
  });

  afterAll(async () => {
    await cleanupTestTables();
  });

  it("should update a single post correctly", async () => {
    const targetPost = posts[0];
    const updatedPost = await postRepository.update({
      where: eq("id", targetPost.id),
      data: {
        title: "Updated Title",
      },
      returning: ["title"],
    });

    expect(updatedPost).toBeDefined();
    expect(updatedPost?.title).toBe("Updated Title");

    // Make sure also updated in the database
    const queryResult = await executor.executeSQL<DomainPost>(
      `SELECT * FROM posts WHERE id = $1`,
      [targetPost.id]
    );
    expect(queryResult.rows[0]).toBeDefined();
    expect(queryResult.rows[0]).toMatchObject({
      title: "Updated Title",
    });
  });

  it("should update multiple fields of a user correctly", async () => {
    const targetUser = users[0];
    const updatedUser = await userRepository.update({
      where: eq("id", targetUser.id),
      data: {
        name: "Updated Name",
        age: 30,
      },
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("Updated Name");
    expect(updatedUser?.age).toBe(30);

    // Make sure also updated in the database
    const fetchedUser = await executor.executeSQL<DomainUser>(
      `SELECT * from users WHERE id = $1`,
      [targetUser.id]
    );
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.rows[0]).toMatchObject({
      name: "Updated Name",
      age: 30,
    });
  });

  it("should return null if the record to update does not exist", async () => {
    const result = await postRepository.update({
      where: like("title", "%post-not-exists%"),
      data: {
        title: "Non-existent Post",
      },
    });
    expect(result).toBeNull();
  });

  it("should not update fields that are not provided", async () => {
    const targetUser = users[1];
    const fetchedUsers = await executor.executeSQL<DomainUser>(
      `SELECT * FROM users WHERE id = $1`,
      [targetUser.id]
    );
    const originalUser = fetchedUsers.rows[0];
    expect(originalUser).toBeDefined();

    const updatedUser = await userRepository.update({
      where: eq("id", targetUser.id),
      data: {
        name: "Partially Updated Name",
      },
    });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe("Partially Updated Name");
    expect(updatedUser?.age).toBe(originalUser?.age); // Age should remain unchanged
  });
});
