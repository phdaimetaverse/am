import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Learning Metaverse</h1>
      <p className="mt-2 text-neutral-300">Starter scaffold. Proceed to dashboard.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/auth/login" className="underline">Login</Link>
        <Link href="/dashboard" className="underline">Dashboard</Link>
        <Link href="/classroom/demo" className="underline">Join Demo Classroom</Link>
      </div>
    </main>
  );
}

