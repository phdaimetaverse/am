"use client";
import React from 'react';

export function Slides({
  slides,
  index,
  onChange,
  canControl,
}: {
  slides: string[];
  index: number;
  onChange: (i: number) => void;
  canControl?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between p-2 text-sm text-neutral-300">
        <span>Slide {index + 1} / {slides.length}</span>
        {canControl && (
          <div className="space-x-2">
            <button className="rounded bg-neutral-800 px-2 py-1" onClick={() => onChange(Math.max(0, index - 1))}>Prev</button>
            <button className="rounded bg-neutral-800 px-2 py-1" onClick={() => onChange(Math.min(slides.length - 1, index + 1))}>Next</button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <img src={slides[index]} alt="slide" className="h-full w-full object-contain" />
      </div>
    </div>
  );
}

