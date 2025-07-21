import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";
// import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms/:roomId/audio",
        {
            schema: {
                params: z.object({
                    roomId: z.string(),
                }),
            },
        },
        async (request, response) => {
            try {
                const { roomId } = request.params;
                const audio = await request.file();

                if (!audio) {
                    throw new Error("Audio is required.");
                }

                const audioBuffer = await audio.toBuffer();
                const audioAsBase64 = audioBuffer.toString("base64");

                const transcription = await transcribeAudio(
                    audioAsBase64,
                    audio.mimetype
                );
                const embeddings = await generateEmbeddings(transcription);

                const result = await db
                    .insert(schema.audioChunks)
                    .values({
                        roomId,
                        transcription,
                        embeddings,
                    })
                    .returning();

                const chunk = result[0];

                if (!chunk) {
                    throw new Error("Error saving audio chunk");
                }

                return response.status(201).send({ chunkId: chunk.id });
                // biome-ignore lint/suspicious/noExplicitAny: avoid unknown error
            } catch (error: any) {
                throw new Error("Error uploading audio", error);
            }
        }
    );
};
