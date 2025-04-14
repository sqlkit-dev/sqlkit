import {SqlExecutor, UpdateQueryBuilder} from "../src";
import {CompositeWhere, SimpleWhere} from "../src/types/query";

// Mock SqlExecutor
const mockExecutor: SqlExecutor = {
    executeSQL: jest.fn(),
};

interface User {
    id: string;
    name: string;
    email: string;
    age?: number;
    roleId?: string;
}

describe("UpdateQueryBuilder", () => {
    let builder: UpdateQueryBuilder<User>;

    beforeEach(() => {
        builder = new UpdateQueryBuilder("users", mockExecutor);
        jest.clearAllMocks();
    });

    describe("Basic Update", () => {
        it("should build correct SQL for basic update", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const result = builder.set(data).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $1, "email" = $2');
            expect(result.sql).toContain("RETURNING *");
            expect(result.values).toEqual(["John Doe", "john@example.com"]);
        });

        it("should build correct SQL for update with specific returning columns", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const result = builder.set(data).returning(["id", "name"]).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $1, "email" = $2');
            expect(result.sql).toContain("RETURNING id, name");
            expect(result.values).toEqual(["John Doe", "john@example.com"]);
        });
    });

    describe("Where Conditions", () => {
        it("should build correct SQL for simple where condition", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const where: SimpleWhere<User> = {
                key: "id",
                operator: "=",
                value: "123",
            };

            const result = builder.set(data).where(where).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $2, "email" = $3');
            expect(result.sql).toContain('WHERE "users"."id" = $1');
            expect(result.sql).toContain("RETURNING *");
            expect(result.values).toEqual(["123", "John Doe", "john@example.com"]);
        });

        it("should build correct SQL for composite AND condition", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const where: CompositeWhere<User> = {
                AND: [
                    {key: "age", operator: ">", value: 18} as SimpleWhere<User>,
                    {key: "name", operator: "=", value: "John"} as SimpleWhere<User>,
                ],
            };

            const result = builder.set(data).where(where).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $3, "email" = $4');
            expect(result.sql).toContain(
                'WHERE ("users"."age" > $1 AND "users"."name" = $2)'
            );
            expect(result.sql).toContain("RETURNING *");
            expect(result.values).toEqual([
                18,
                "John",
                "John Doe",
                "john@example.com"
            ]);
        });

        it("should build correct SQL for composite OR condition", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const where: CompositeWhere<User> = {
                OR: [
                    {key: "age", operator: ">", value: 18} as SimpleWhere<User>,
                    {key: "name", operator: "=", value: "John"} as SimpleWhere<User>,
                ],
            };

            const result = builder.set(data).where(where).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $3, "email" = $4');
            expect(result.sql).toContain(
                'WHERE ("users"."age" > $1 OR "users"."name" = $2)'
            );
            expect(result.sql).toContain("RETURNING *");
            expect(result.values).toEqual([18, 'John', 'John Doe', 'john@example.com']);
        });

        it("should build correct SQL for complex nested conditions", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
            };

            const where: CompositeWhere<User> = {
                AND: [
                    {key: "age", operator: ">", value: 18} as SimpleWhere<User>,
                    {
                        OR: [
                            {
                                key: "name",
                                operator: "=",
                                value: "John",
                            } as SimpleWhere<User>,
                            {
                                key: "name",
                                operator: "=",
                                value: "Jane",
                            } as SimpleWhere<User>,
                        ],
                    } as CompositeWhere<User>,
                ],
            };

            const result = builder.set(data).where(where).build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $4, "email" = $5');
            expect(result.sql).toContain(
                'WHERE ("users"."age" > $1 AND ("users"."name" = $2 OR "users"."name" = $3))'
            );
            expect(result.sql).toContain("RETURNING *");
            expect(result.values).toEqual([
                18,
                "John",
                "Jane",
                "John Doe",
                "john@example.com"
            ]);
        });
    });

    describe("Complex Update", () => {
        it("should build correct SQL for complex update with all clauses", () => {
            const data = {
                name: "John Doe",
                email: "john@example.com",
                age: 25,
            };

            const where: CompositeWhere<User> = {
                AND: [
                    {key: "age", operator: ">", value: 18} as SimpleWhere<User>,
                    {
                        OR: [
                            {
                                key: "name",
                                operator: "=",
                                value: "John",
                            } as SimpleWhere<User>,
                            {
                                key: "name",
                                operator: "=",
                                value: "Jane",
                            } as SimpleWhere<User>,
                        ],
                    } as CompositeWhere<User>,
                ],
            };

            const result = builder
                .set(data)
                .where(where)
                .returning(["id", "name", "email", "age"])
                .build();

            expect(result.sql).toContain('UPDATE "users"');
            expect(result.sql).toContain('SET "name" = $4, "email" = $5, "age" = $6');
            expect(result.sql).toContain(
                'WHERE ("users"."age" > $1 AND ("users"."name" = $2 OR "users"."name" = $3))'
            );
            expect(result.sql).toContain("RETURNING id, name, email, age");
            expect(result.values).toEqual([
                18,
                "John",
                "Jane",
                "John Doe",
                "john@example.com",
                25
            ]);
        });
    });
});
