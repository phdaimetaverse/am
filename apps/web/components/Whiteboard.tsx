"use client";
import React, { useEffect, useRef, useState } from 'react';

type Stroke = {
  id: string;
  color: string;
  width: number;
  points: number[];
  userId: string;
  ts: number;
};

export function Whiteboard({
  strokes,
  onStroke,
}: {
  strokes: Stroke[];
  onStroke: (stroke: Stroke) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState<number[]>([]);

  // Resize canvas to fill parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const resize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      redraw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  // Redraw all strokes
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of strokes) {
      drawStroke(ctx, s.points, s.color, s.width);
    }
    if (current.length > 0) {
      drawStroke(ctx, current, '#fff', 2);
    }
  };

  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, current]);

  function toLocal(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
  }

  function onDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    setDrawing(true);
    setCurrent((p) => p.concat(toLocal(e)));
  }
  function onMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (!drawing) return;
    setCurrent((p) => p.concat(toLocal(e)));
  }
  function onUp() {
    if (!drawing || current.length < 4) {
      setDrawing(false);
      setCurrent([]);
      return;
    }
    const stroke: Stroke = {
      id: crypto.randomUUID(),
      color: '#ffffff',
      width: 2,
      points: current,
      userId: 'local',
      ts: Date.now(),
    };
    onStroke(stroke);
    setDrawing(false);
    setCurrent([]);
  }

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full touch-none select-none bg-black/10"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    />
  );
}

function drawStroke(ctx: CanvasRenderingContext2D, points: number[], color: string, width: number) {
  if (points.length < 4) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) {
    ctx.lineTo(points[i], points[i + 1]);
  }
  ctx.stroke();
}


