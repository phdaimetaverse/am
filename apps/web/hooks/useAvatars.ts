"use client";
import { useEffect, useRef, useState } from 'react';

type Vec3 = [number, number, number];

export type Avatar = {
  id: string;
  name: string;
  position: Vec3;
  rotationY: number;
  muted?: boolean;
  handRaised?: boolean;
};

export function useAvatars(socket: any) {
  const [avatars, setAvatars] = useState<Record<string, Avatar>>({});
  const localIdRef = useRef<string>('local');

  useEffect(() => {
    if (!socket) return;
    function onState(payload: any) {
      if (payload?.avatars) setAvatars(payload.avatars);
    }
    function onMove(payload: any) {
      if (!payload || !payload.userId) return;
      setAvatars((prev) => {
        const next = { ...prev } as any;
        if (!next[payload.userId]) return prev;
        next[payload.userId] = {
          ...next[payload.userId],
          position: payload.position,
          rotationY: payload.rotationY,
        };
        return next;
      });
    }
    socket.on('stateSync', onState);
    socket.on('avatarMove', onMove);
    return () => {
      socket.off('stateSync', onState);
      socket.off('avatarMove', onMove);
    };
  }, [socket]);

  return { avatars, setAvatars, localIdRef } as const;
}

export function useKeyboardMovement(socket: any, localId: string, setAvatars: React.Dispatch<React.SetStateAction<Record<string, Avatar>>>) {
  const vel = useRef<Vec3>([0, 0, 0]);
  const rot = useRef(0);
  const pressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    function key(e: KeyboardEvent, d: boolean) {
      pressed.current[e.key.toLowerCase()] = d;
    }
    window.addEventListener('keydown', (e) => key(e, true));
    window.addEventListener('keyup', (e) => key(e, false));
    return () => {
      window.removeEventListener('keydown', (e) => key(e, true));
      window.removeEventListener('keyup', (e) => key(e, false));
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const speed = 3.0;
      const forward = (pressed.current['w'] ? 1 : 0) + (pressed.current['s'] ? -1 : 0);
      const right = (pressed.current['d'] ? 1 : 0) + (pressed.current['a'] ? -1 : 0);
      const rotDelta = (pressed.current['e'] ? 1 : 0) + (pressed.current['q'] ? -1 : 0);
      rot.current += rotDelta * dt * 2.5;
      const sin = Math.sin(rot.current);
      const cos = Math.cos(rot.current);
      const vx = (forward * -sin + right * cos) * speed * dt;
      const vz = (forward * -cos - right * sin) * speed * dt;
      setAvatars((prev) => {
        const next = { ...prev } as any;
        const me = next[localId];
        if (!me) return prev;
        const nx: Vec3 = [me.position[0] + vx, 0, me.position[2] + vz];
        next[localId] = { ...me, position: nx, rotationY: rot.current };
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [localId, setAvatars]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatars((prev) => {
        const me = prev[localId];
        if (me) socket?.emit('avatarMove', { position: me.position, rotationY: me.rotationY });
        return prev;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [localId, setAvatars, socket]);
}


