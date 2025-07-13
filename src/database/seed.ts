import { reset, seed } from "drizzle-seed";
import { client, db } from "./connection.ts";
import { schema } from "./schema/index.ts";

await reset(db, schema);
await seed(db, schema).refine((faker) => {
    return {
        rooms: {
            count: 25,
            columns: {
                name: faker.companyName(),
                description: faker.loremIpsum(),
            },
        },
    };
});

await client.end();

// biome-ignore lint/suspicious/noConsole: only used in dev mode
console.log("Database seeded");
