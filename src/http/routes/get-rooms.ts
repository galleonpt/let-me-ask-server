import { count, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const getRoomsRoute: FastifyPluginCallbackZod = (app) => {
    app.get("/rooms", async () => {
        try {
            const results = await db
                .select({
                    id: schema.rooms.id,
                    name: schema.rooms.name,
                    createdAt: schema.rooms.createdAt,
                    questionsCount: count(schema.questions.id),
                })
                .from(schema.rooms)
                .leftJoin(
                    schema.questions,
                    eq(schema.questions.room_id, schema.rooms.id)
                )
                .groupBy(schema.rooms.id)
                .orderBy(schema.rooms.createdAt);

            return results;
            // biome-ignore lint/suspicious/noExplicitAny: avoid unknown error
        } catch (error: any) {
            throw new Error("Error fetching rooms", error);
        }
    });
};
