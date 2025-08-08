import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Welcome, {session.user.name}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-2">VR Classroom</h2>
          <p className="text-sm text-zinc-600 mb-4">Join the 3D environment to attend lessons.</p>
          <Link href="/classroom" className="inline-flex items-center gap-2 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2">
            Enter Classroom
          </Link>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-2">My Courses</h2>
          <ul className="list-disc pl-5 text-sm text-zinc-700">
            <li>Intro to 3D Math</li>
            <li>WebXR Fundamentals</li>
            <li>Interactive Pedagogy</li>
          </ul>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-2">Next session</h2>
          <p className="text-sm">Wednesday 10:00 AM — VR Classroom A</p>
        </div>
      </div>
    </div>
  );
}


