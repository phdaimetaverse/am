"use client";
import React, { useEffect, useRef, useState } from 'react';

export function TutorPanel({ slideText, progress }: { slideText?: string; progress?: any }) {
  const [input, setInput] = useState('Explain this slide.');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  async function ask(mode = 'explain') {
    setLoading(true);
    setOutput('');
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    const resp = await fetch('/api/tutor', {
      method: 'POST',
      body: JSON.stringify({ mode, slideText, progress, question: input }),
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
    });
    if (!resp.body) {
      setLoading(false);
      return;
    }
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let text = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value);
      setOutput(text);
    }
    setLoading(false);
  }

  useEffect(() => () => controllerRef.current?.abort(), []);

  return (
    <div className="flex h-full w-80 flex-col border-l border-neutral-800 bg-neutral-900">
      <div className="p-2 text-sm font-semibold">AI Tutor</div>
      <div className="flex-1 overflow-auto whitespace-pre-wrap p-2 text-sm text-neutral-200">{output || 'Ask a question about the slide or your progress.'}</div>
      <div className="space-y-2 p-2">
        <textarea className="h-24 w-full rounded bg-neutral-800 p-2 text-sm" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="flex gap-2">
          <button className="rounded bg-blue-600 px-2 py-1 text-sm" onClick={() => ask('explain')} disabled={loading}>Explain</button>
          <button className="rounded bg-emerald-600 px-2 py-1 text-sm" onClick={() => ask('quiz')} disabled={loading}>Quiz me</button>
          <button className="rounded bg-purple-600 px-2 py-1 text-sm" onClick={() => ask('summarize')} disabled={loading}>Summarize</button>
        </div>
      </div>
    </div>
  );
}

