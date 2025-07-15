import { desc, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const getRoomQuestionsRoute: FastifyPluginCallbackZod = (app) => {
    app.get(
        "/rooms/:roomId/questions",
        {
            schema: {
                params: z.object({
                    roomId: z.string(),
                }),
            },
        },
        async (request) => {
            const { roomId } = request.params;

            const result = await db
                .select({
                    id: schema.questions.id,
                    question: schema.questions.question,
                    answer: schema.questions.answer,
                    created_at: schema.questions.createdAt,
                })
                .from(schema.questions)
                .where(eq(schema.questions.room_id, roomId))
                .orderBy(desc(schema.questions.createdAt));

            return result;
        }
    );
};
