"use client";
import { ClassroomScene, Avatars } from '@metaverse/three/src/index';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createClassroomSocket, joinClassroom } from '@metaverse/rt/src/index';
import { Whiteboard } from '@/components/Whiteboard';
import { Slides } from '@/components/Slides';
import { useAvatars, useKeyboardMovement } from '@/hooks/useAvatars';
import { TutorPanel } from '@/components/TutorPanel';
import { HUD } from '@/components/HUD';
import { useVoice } from '@/hooks/useVoice';
import { useSpatialAudio } from '@/hooks/useSpatialAudio';
import { ChatPanel } from '@/components/ChatPanel';
import { useSession } from 'next-auth/react';
import { InstructorToolbar } from '@/components/InstructorToolbar';

export default function ClassroomPage() {
  const params = useParams<{ sessionId: string }>();
  const { data: session } = useSession();
  const [connected, setConnected] = useState(false);
  const [strokes, setStrokes] = useState<any[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const socketRef = useRef<ReturnType<typeof createClassroomSocket> | null>(null);
  const { avatars, setAvatars, localIdRef } = useAvatars(socketRef.current);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_RT_URL || 'http://localhost:4001';
    const role = (session?.user as any)?.role || 'student';
    const socket = createClassroomSocket(baseUrl, 'anon', role);
    socketRef.current = socket;
    socket.on('connect', () => {
      setConnected(true);
      joinClassroom(socket, { sessionId: params.sessionId, displayName: 'Guest' });
    });
    socket.on('stateSync', (payload: any) => {
      if (payload?.strokes) setStrokes(payload.strokes);
      if (typeof payload?.slideIndex === 'number') setSlideIndex(payload.slideIndex);
    });
    socket.on('whiteboardDelta', (payload: any) => {
      if (payload?.stroke) setStrokes((s) => s.concat(payload.stroke));
    });
    socket.on('slideSet', (payload: any) => {
      if (typeof payload?.index === 'number') setSlideIndex(payload.index);
    });
    return () => {
      socket.disconnect();
    };
  }, [params.sessionId]);

  useKeyboardMovement(socketRef.current, localIdRef.current, setAvatars);
  const { enabled: micOn, toggle: toggleMic, remotes } = useVoice(socketRef.current, localIdRef.current);
  useSpatialAudio(remotes as any, avatars as any);

  return (
    <main className="h-[calc(100vh-0px)]">
      <div className="absolute z-10 m-2 rounded bg-neutral-900/70 px-3 py-2 text-sm">
        Session: {params.sessionId} {connected ? '(connected)' : '(connecting...)'}
      </div>
      <div className="grid h-full grid-cols-[1fr_1fr_320px_320px]">
        <div className="relative border-r border-neutral-800">
          <Whiteboard
            strokes={strokes}
            onStroke={(stroke) => {
              setStrokes((s) => s.concat(stroke));
              socketRef.current?.emit('whiteboardDelta', { stroke });
            }}
          />
        </div>
        <div className="relative">
          <Slides
            slides={[
              'https://placehold.co/1200x800?text=Slide+1',
              'https://placehold.co/1200x800?text=Slide+2',
              'https://placehold.co/1200x800?text=Slide+3',
            ]}
            index={slideIndex}
            canControl={(session?.user as any)?.role === 'instructor' || (session?.user as any)?.role === 'admin'}
            onChange={(i) => {
              setSlideIndex(i);
              socketRef.current?.emit('slideSet', { index: i });
            }}
          />
        </div>
        <TutorPanel slideText={`Slide ${slideIndex + 1} placeholder text`} />
        <ChatPanel socket={socketRef.current} />
        <div className="absolute inset-0 pointer-events-none">
          <ClassroomScene>
            <Avatars
              avatars={Object.entries(avatars).map(([id, a]) => ({
                id,
                name: a.name || id.slice(0, 4),
                position: a.position,
                rotationY: a.rotationY,
                muted: a.muted,
                handRaised: a.handRaised,
              }))}
            />
          </ClassroomScene>
          <HUD micOn={micOn} onToggleMic={() => toggleMic()} onExit={() => window.location.href = '/dashboard'} />
          {((session?.user as any)?.role === 'instructor' || (session?.user as any)?.role === 'admin') && (
            <InstructorToolbar socket={socketRef.current} avatars={avatars as any} />
          )}
        </div>
      </div>
    </main>
  );
}

