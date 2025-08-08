import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveRoomState(sessionId: string, snapshot: any) {
  const json = JSON.stringify(snapshot);
  await prisma.roomState.upsert({
    where: { sessionId },
    update: { snapshotJson: json },
    create: { sessionId, snapshotJson: json },
  });
}

export async function loadRoomState(sessionId: string): Promise<any | null> {
  const rs = await prisma.roomState.findUnique({ where: { sessionId } });
  return rs ? JSON.parse(rs.snapshotJson) : null;
}

