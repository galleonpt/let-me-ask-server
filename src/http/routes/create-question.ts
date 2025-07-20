import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms/:roomId/questions",
        {
            schema: {
                body: z.object({
                    question: z.string().min(1),
                }),
                params: z.object({
                    roomId: z.string().min(1),
                }),
            },
        },
        async (request, response) => {
            try {
                const { question } = request.body;
                const { roomId } = request.params;

                const result = await db
                    .insert(schema.questions)
                    .values({
                        room_id: roomId,
                        question,
                    })
                    .returning();

                const insertedQuestion = result[0];

                if (!insertedQuestion) {
                    throw new Error("Failed to create new room.");
                }

                return response
                    .status(201)
                    .send({ questionId: insertedQuestion.id });
                // biome-ignore lint/suspicious/noExplicitAny: avoid unknown error
            } catch (error: any) {
                throw new Error("Error creating a room", error);
            }
        }
    );
};
