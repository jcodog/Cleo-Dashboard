import { z } from "zod";
import { j, publicProcedure } from "@/server/jstack";

const chatMessageSchema = z.object({
  roomId: z.string(),
  author: z.string(),
  text: z.string(),
  platform: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

const chatValidator = z.object({
  message: chatMessageSchema,
});

export const overlayRouter = j.router({
  chat: publicProcedure
    .incoming(chatValidator)
    .outgoing(chatValidator)
    .ws(({ io }) => ({
      async onConnect({ socket }) {
        socket.on("message", async (message) => {
          await io.to(message.roomId).emit("message", message);
        });
      },
    })),
});
