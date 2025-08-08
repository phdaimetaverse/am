import * as React from 'react';

export function Button({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string; }) {
  return (
    <button onClick={onClick} className={"px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white " + (className ?? '')}>
      {children}
    </button>
  );
}

