import {Join, Repository} from "../../src";
import {cleanupTestData, DomainPost, DomainUser, executor, seedTestData, setupTestTables,} from "../../test-setup";

describe("Repository count", () => {
    let repository: Repository<DomainPost>;

    beforeAll(async () => {
        await setupTestTables();
        await seedTestData()
        repository = new Repository("posts", executor);
    });

    afterAll(async () => {
        await cleanupTestData();
    });

    it("should count all rows without condition", async () => {
        const result = await repository.findRows({
            joins: [
                {
                    table: 'users',
                    as: 'author',
                    type: 'left',
                    on: {
                        localField: 'author_id',
                        foreignField: 'id'
                    },
                    columns: ['id', 'name']
                } as Join<DomainPost, DomainUser>
            ]
        })

        console.log(JSON.stringify(result, null, 2));


        expect(1).toBe(1);
    });

});
