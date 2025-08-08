"use client";
import React from 'react';

export function HUD({ onToggleMic, micOn, onExit }: { onToggleMic: () => void; micOn: boolean; onExit: () => void }) {
  return (
    <div className="pointer-events-auto absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded bg-neutral-900/80 px-3 py-2 shadow">
      <div className="flex items-center gap-3 text-sm">
        <button className={`rounded px-3 py-1 ${micOn ? 'bg-emerald-600' : 'bg-neutral-700'}`} onClick={onToggleMic}>
          {micOn ? 'Mic On' : 'Mic Off'}
        </button>
        <button className="rounded bg-red-600 px-3 py-1" onClick={onExit}>Exit</button>
      </div>
    </div>
  );
}

