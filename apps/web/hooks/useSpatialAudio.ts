"use client";
import { useEffect, useRef } from 'react';

type Remote = { userId: string; stream: MediaStream };
type Avatar = { position: [number, number, number] };

export function useSpatialAudio(remotes: Remote[], avatars: Record<string, Avatar>) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, { source: MediaStreamAudioSourceNode; panner: PannerNode; gain: GainNode }>>({});

  useEffect(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current!;
    for (const { userId, stream } of remotes) {
      if (nodesRef.current[userId]) continue;
      const source = ctx.createMediaStreamSource(stream);
      const panner = ctx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 50;
      panner.rolloffFactor = 1;
      const gain = ctx.createGain();
      source.connect(panner).connect(gain).connect(ctx.destination);
      nodesRef.current[userId] = { source, panner, gain };
    }
    // cleanup for removed streams
    for (const uid of Object.keys(nodesRef.current)) {
      if (!remotes.find((r) => r.userId === uid)) {
        nodesRef.current[uid].gain.disconnect();
        nodesRef.current[uid].panner.disconnect();
        nodesRef.current[uid].source.disconnect();
        delete nodesRef.current[uid];
      }
    }
  }, [remotes]);

  useEffect(() => {
    for (const [uid, node] of Object.entries(nodesRef.current)) {
      const a = avatars[uid];
      if (!a) continue;
      const [x, y, z] = a.position;
      node.panner.positionX.value = x;
      node.panner.positionY.value = y + 1.5;
      node.panner.positionZ.value = z;
    }
  }, [avatars]);
}


