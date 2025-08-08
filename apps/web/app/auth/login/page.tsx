"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) {
      setErr(res.error);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full rounded bg-neutral-800 p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="w-full rounded bg-neutral-800 p-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button className="px-3 py-2 rounded bg-blue-600">Sign In</button>
      </form>
    </main>
  );
}

