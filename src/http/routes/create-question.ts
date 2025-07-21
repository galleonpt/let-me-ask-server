import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

const SIMILARITY_VALUE = 0.7;

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

                const embeddings = await generateEmbeddings(question);

                const embeddingsAsString = `[${embeddings.join(",")}]`;

                const chunks = await db
                    .select({
                        id: schema.audioChunks.id,
                        transcription: schema.audioChunks.transcription,
                        similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
                    })
                    .from(schema.audioChunks)
                    .where(
                        and(
                            eq(schema.audioChunks.roomId, roomId),
                            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > ${SIMILARITY_VALUE}`
                        )
                    )
                    .orderBy(
                        sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
                    )
                    .limit(3);

                let answer: string | null = null;

                if (chunks.length > 0) {
                    const transcriptions = chunks.map(
                        (chunk) => chunk.transcription
                    );

                    answer = await generateAnswer(question, transcriptions);
                }

                const result = await db
                    .insert(schema.questions)
                    .values({
                        room_id: roomId,
                        question,
                        answer,
                    })
                    .returning();

                const insertedQuestion = result[0];

                if (!insertedQuestion) {
                    throw new Error("Failed to create new question.");
                }

                return response
                    .status(201)
                    .send({ questionId: insertedQuestion.id, answer });
                // biome-ignore lint/suspicious/noExplicitAny: avoid unknown error
            } catch (error: any) {
                throw new Error("Error creating a question", error);
            }
        }
    );
};
