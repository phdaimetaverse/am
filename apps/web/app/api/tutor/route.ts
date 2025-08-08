import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { mode, slideText, progress, question } = body || {};
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const content = `Mock tutor (no OPENAI_API_KEY set)\nMode: ${mode || 'explain'}\nSlide: ${sliceText(slideText)}\nQ: ${question || ''}\nProgress: ${JSON.stringify(progress || {})}`;
        const chunks = content.match(/.{1,50}/g) || [];
        let i = 0;
        const interval = setInterval(() => {
          if (i >= chunks.length) {
            clearInterval(interval);
            controller.close();
            return;
          }
          controller.enqueue(encoder.encode(chunks[i++]));
        }, 30);
      },
    });
    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  // Simple OpenAI chat completion (text) without function calling for MVP
  try {
    const prompt = buildPrompt(mode, slideText, progress, question);
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        stream: true,
        messages: [
          { role: 'system', content: 'You are a helpful AI tutor for a live classroom. Be concise, give hints first, cite slide context.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!resp.ok || !resp.body) {
      return new Response('Tutor error', { status: 500 });
    }
    return new Response(resp.body, { headers: { 'Content-Type': 'text/event-stream' } });
  } catch (e) {
    return new Response('Tutor error', { status: 500 });
  }
}

function buildPrompt(mode?: string, slideText?: string, progress?: any, question?: string) {
  return `Mode: ${mode || 'explain'}\nSlide Context:\n${slideText || ''}\nProgress:${JSON.stringify(progress || {})}\nQuestion:${question || ''}`;
}

function sliceText(t?: string) {
  if (!t) return '';
  return t.length > 200 ? t.slice(0, 200) + '…' : t;
}


