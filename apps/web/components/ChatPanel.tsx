"use client";
import React, { useEffect, useRef, useState } from 'react';

export function ChatPanel({ socket }: { socket: any }) {
  const [messages, setMessages] = useState<{ userId: string; name: string; text: string; ts: number }[]>([]);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;
    function onChat(m: any) {
      setMessages((prev) => prev.concat(m).slice(-200));
    }
    socket.on('chat', onChat);
    return () => socket.off('chat', onChat);
  }, [socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  function send() {
    if (!text.trim()) return;
    socket?.emit('chat', { text: text.trim() });
    setText('');
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-neutral-800 bg-neutral-900">
      <div className="p-2 text-sm font-semibold">Chat</div>
      <div className="flex-1 space-y-1 overflow-auto p-2 text-sm">
        {messages.map((m, i) => (
          <div key={i} className="">
            <span className="text-neutral-400">[{new Date(m.ts).toLocaleTimeString()}]</span> <span className="font-semibold">{m.name}</span>: {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="space-y-2 p-2">
        <input className="w-full rounded bg-neutral-800 p-2 text-sm" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type message" />
        <button className="w-full rounded bg-neutral-700 px-2 py-1 text-sm" onClick={send}>Send</button>
      </div>
    </div>
  );
}

