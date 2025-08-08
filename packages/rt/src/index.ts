import { io, Socket } from 'socket.io-client';
import { z } from 'zod';
import { joinRoomSchema, avatarMoveSchema, whiteboardDeltaSchema, slideSetSchema } from '@metaverse/core/src/schemas';

export type ClassroomSocket = Socket<
  {
    connect_error: (err: Error) => void;
  },
  {
    stateSync: (payload: any) => void;
    avatarMove: (payload: z.infer<typeof avatarMoveSchema>) => void;
    whiteboardDelta: (payload: z.infer<typeof whiteboardDeltaSchema>) => void;
    slideSet: (payload: { index: number }) => void;
  }
>;

export function createClassroomSocket(baseUrl: string, authToken: string, role?: 'student' | 'instructor' | 'admin'): ClassroomSocket {
  const socket: ClassroomSocket = io(`${baseUrl}/classroom`, {
    transports: ['websocket'],
    auth: { token: authToken, role },
  }) as ClassroomSocket;
  return socket;
}

export function joinClassroom(socket: ClassroomSocket, payload: z.infer<typeof joinRoomSchema>) {
  const parsed = joinRoomSchema.safeParse(payload);
  if (!parsed.success) throw new Error('Invalid join payload');
  socket.emit('join', parsed.data);
}

