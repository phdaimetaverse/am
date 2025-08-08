import { NextRequest } from "next/server";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };

  // Demo credentials; replace with real auth provider later
  const isValid = email === "student@example.com" && password === "learn";
  if (!isValid) {
    return Response.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const session = await getSession();
  session.user = {
    id: "u_001",
    email: email!,
    name: "Student User",
    role: "student",
  };
  await session.save();

  return Response.json({ ok: true });
}


