"use client";
import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

type RemoteStream = { userId: string; stream: MediaStream };

export function useVoice(socket: any, localUserId: string) {
  const [enabled, setEnabled] = useState(false);
  const [remotes, setRemotes] = useState<RemoteStream[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Record<string, Peer.Instance>>({});

  useEffect(() => {
    if (!socket) return;
    function onSignal({ from, signal }: any) {
      const peer = peersRef.current[from];
      if (peer) peer.signal(signal);
    }
    socket.on('voiceSignal', onSignal);
    return () => socket.off('voiceSignal', onSignal);
  }, [socket]);

  async function toggle(enabledNext?: boolean) {
    const target = enabledNext ?? !enabled;
    setEnabled(target);
    if (target) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      // Ask server who is in the room via stateSync; then initiate peers to all current others
      // Minimal approach: rely on sockets to create peers by self-init broadcast
      socket.emit('voiceReady');
      socket.on('voiceUser', ({ userId }: any) => {
        if (userId === localUserId) return;
        if (peersRef.current[userId]) return;
        const peer = new Peer({ initiator: true, trickle: true, stream });
        peersRef.current[userId] = peer;
        peer.on('signal', (signal) => socket.emit('voiceSignal', { to: userId, signal }));
        peer.on('stream', (s) => setRemotes((r) => r.concat({ userId, stream: s })));
      });
      socket.emit('voiceAnnounce');
    } else {
      Object.values(peersRef.current).forEach((p) => p.destroy());
      peersRef.current = {};
      setRemotes([]);
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      socket.emit('voiceOff');
    }
  }

  useEffect(() => {
    if (!socket) return;
    const onKicked = () => {
      // Best-effort cleanup then redirect
      if (enabled) toggle(false);
      window.location.href = '/dashboard';
    };
    const onMuted = ({ userId }: any) => {
      if (userId === localUserId && enabled) toggle(false);
    };
    socket.on('kicked', onKicked);
    socket.on('muted', onMuted);
    return () => {
      socket.off('kicked', onKicked);
      socket.off('muted', onMuted);
    };
  }, [socket, enabled, localUserId]);

  return { enabled, toggle, remotes } as const;
}


