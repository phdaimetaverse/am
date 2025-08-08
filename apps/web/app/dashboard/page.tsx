import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded bg-neutral-800 p-4">Completion: 42%</div>
        <div className="rounded bg-neutral-800 p-4">Daily Streak: 3</div>
        <div className="rounded bg-neutral-800 p-4">Next Session: Today 5pm</div>
        <div className="rounded bg-neutral-800 p-4">Avg Quiz Score: 78%</div>
      </div>
      <Link href="/classroom/demo" className="underline">Join Demo Class</Link>
    </main>
  );
}

