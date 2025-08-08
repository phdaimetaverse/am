"use client";
import React from 'react';

export function InstructorToolbar({ socket, avatars }: { socket: any; avatars: Record<string, { name: string }> }) {
  const users = Object.entries(avatars);
  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-20 w-64 rounded border border-neutral-800 bg-neutral-900/90 p-2 text-sm">
      <div className="mb-2 font-semibold">Instructor Controls</div>
      <div className="max-h-64 space-y-2 overflow-auto">
        {users.length === 0 && <div className="text-neutral-400">No users</div>}
        {users.map(([id, a]) => (
          <div key={id} className="flex items-center justify-between gap-2">
            <div className="truncate" title={id}>{a.name || id.slice(0, 6)}</div>
            <div className="flex gap-1">
              <button className="rounded bg-neutral-700 px-2 py-1" onClick={() => socket?.emit('muteUser', { targetId: id })}>Mute</button>
              <button className="rounded bg-red-700 px-2 py-1" onClick={() => socket?.emit('kickUser', { targetId: id })}>Kick</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


