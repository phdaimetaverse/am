import { z } from 'zod';

export const joinRoomSchema = z.object({
  sessionId: z.string().min(1),
  displayName: z.string().min(1).max(60),
});

export const avatarMoveSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotationY: z.number(),
});

export const whiteboardDeltaSchema = z.object({
  stroke: z.object({
    id: z.string(),
    color: z.string(),
    width: z.number().min(1).max(20),
    points: z.array(z.number()),
    userId: z.string(),
    ts: z.number(),
  }),
});

export const slideSetSchema = z.object({ index: z.number().int().min(0) });

export type JoinRoomPayload = z.infer<typeof joinRoomSchema>;

