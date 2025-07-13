import type { FastifyInstance } from "fastify";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = (
    app: FastifyInstance
) => {
    app.get("/rooms", async () => {
        const results = await db
            .select({
                id: schema.rooms.id,
                name: schema.rooms.name,
            })
            .from(schema.rooms)
            .orderBy(schema.rooms.createdAt);

        return results;
    });
};
