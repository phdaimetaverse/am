import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pino from 'pino';
import { z } from 'zod';
// Remove DB persistence for simpler local run; can be re-enabled later

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  },
});

type Vec3 = [number, number, number];

const Rooms: Record<string, {
  avatars: Record<string, { position: Vec3; rotationY: number; name: string; muted: boolean; handRaised: boolean }>;
  strokes: any[];
  slideIndex: number;
}> = {};

const nsClassroom = io.of('/classroom');

nsClassroom.on('connection', (socket) => {
  let sessionId: string | null = null;
  let userId: string = socket.id;
  let displayName: string = 'User';
  let voiceEnabledUsers: Set<string> = new Set();
  const role: 'student' | 'instructor' | 'admin' = (socket.handshake.auth?.role as any) || 'student';

  socket.on('join', async (payload: any) => {
    const parsed = z.object({ sessionId: z.string(), displayName: z.string() }).safeParse(payload);
    if (!parsed.success) return;
    sessionId = parsed.data.sessionId;
    displayName = parsed.data.displayName;
    if (!Rooms[sessionId]) Rooms[sessionId] = { avatars: {}, strokes: [], slideIndex: 0 };
    Rooms[sessionId].avatars[userId] = { position: [0, 0, 0], rotationY: 0, name: displayName, muted: false, handRaised: false };
    socket.join(sessionId);
    socket.emit('stateSync', { avatars: Rooms[sessionId].avatars, strokes: Rooms[sessionId].strokes, slideIndex: Rooms[sessionId].slideIndex });
    socket.to(sessionId).emit('stateSync', { avatars: Rooms[sessionId].avatars });
  });

  socket.on('avatarMove', (payload: any) => {
    if (!sessionId) return;
    const parsed = z.object({ position: z.tuple([z.number(), z.number(), z.number()]), rotationY: z.number() }).safeParse(payload);
    if (!parsed.success) return;
    const room = Rooms[sessionId];
    if (!room) return;
    const a = room.avatars[userId];
    if (!a) return;
    a.position = parsed.data.position;
    a.rotationY = parsed.data.rotationY;
    socket.to(sessionId).emit('avatarMove', { userId, ...parsed.data });
  });

  socket.on('whiteboardDelta', (payload: any) => {
    if (!sessionId) return;
    const parsed = z.object({ stroke: z.any() }).safeParse(payload);
    if (!parsed.success) return;
    const room = Rooms[sessionId];
    if (!room) return;
    room.strokes.push(parsed.data.stroke);
    socket.to(sessionId).emit('whiteboardDelta', parsed.data);
  });

  socket.on('slideSet', (payload: any) => {
    if (!sessionId) return;
    const parsed = z.object({ index: z.number().int().min(0) }).safeParse(payload);
    if (!parsed.success) return;
    const room = Rooms[sessionId];
    if (!room) return;
    // Enforce instructor/admin
    if (!(role === 'instructor' || role === 'admin')) return;
    room.slideIndex = parsed.data.index;
    nsClassroom.to(sessionId).emit('slideSet', { index: room.slideIndex });
  });

  // Chat with rate limiting and simple profanity filter
  const chatState = { lastAt: 0 };
  const banned = new Set<string>();
  const badWords = [/\bshit\b/i, /\bfuck\b/i, /\bass\b/i];
  socket.on('chat', (payload: any) => {
    if (!sessionId) return;
    if (banned.has(userId)) return;
    const parsed = z.object({ text: z.string().min(1).max(500) }).safeParse(payload);
    if (!parsed.success) return;
    const now = Date.now();
    if (now - chatState.lastAt < 800) return; // 0.8s per message
    chatState.lastAt = now;
    let text = parsed.data.text;
    for (const w of badWords) text = text.replace(w, '***');
    nsClassroom.to(sessionId).emit('chat', { userId, name: displayName, text, ts: now });
  });

  // Moderation: mute/kick by instructor/admin
  socket.on('muteUser', ({ targetId }: any) => {
    if (!sessionId) return;
    if (!(role === 'instructor' || role === 'admin')) return;
    nsClassroom.to(sessionId).emit('muted', { userId: targetId });
  });
  socket.on('kickUser', ({ targetId }: any) => {
    if (!sessionId) return;
    if (!(role === 'instructor' || role === 'admin')) return;
    nsClassroom.to(targetId).emit('kicked');
  });

  socket.on('disconnect', () => {
    if (!sessionId) return;
    const room = Rooms[sessionId];
    if (!room) return;
    delete room.avatars[userId];
    socket.to(sessionId).emit('stateSync', { avatars: room.avatars });
  });

  // WebRTC signaling (minimal P2P mesh)
  socket.on('voiceReady', () => {
    if (!sessionId) return;
    nsClassroom.to(sessionId).emit('voiceUser', { userId });
  });
  socket.on('voiceAnnounce', () => {
    if (!sessionId) return;
    nsClassroom.to(sessionId).emit('voiceUser', { userId });
  });
  socket.on('voiceSignal', ({ to, signal }) => {
    if (!sessionId) return;
    nsClassroom.to(to).emit('voiceSignal', { from: userId, signal });
  });
});

const PORT = Number(process.env.PORT || 4001);
server.listen(PORT, () => logger.info(`RT server listening on :${PORT}`));

