import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../database/connection.ts";
import { schema } from "../../database/schema/index.ts";

export const createRoomRoute: FastifyPluginCallbackZod = (app) => {
    app.post(
        "/rooms",
        {
            schema: {
                body: z.object({
                    name: z.string().min(1),
                    description: z.string().optional(),
                }),
            },
        },
        async (request, response) => {
            try {
                const { name, description } = request.body;

                const result = await db
                    .insert(schema.rooms)
                    .values({
                        name,
                        description,
                    })
                    .returning();

                const insertedRoom = result[0];

                if (!insertedRoom) {
                    throw new Error("Failed to create new room.");
                }

                return response.status(201).send({ roomId: insertedRoom.id });
                // biome-ignore lint/suspicious/noExplicitAny: avoid unknown error
            } catch (error: any) {
                throw new Error("Error creating a room", error);
            }
        }
    );
};
