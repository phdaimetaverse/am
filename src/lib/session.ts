import { cookies } from "next/headers";
import { getIronSession, type IronSessionOptions } from "iron-session";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor" | "admin";
};

export type SessionData = {
  user?: AuthenticatedUser;
};

export const sessionOptions: IronSessionOptions = {
  cookieName: "ml_session",
  password:
    process.env.IRON_SESSION_PASSWORD ||
    "dev_password_change_me_dev_password_change_me", // at least 32 chars for dev
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    path: "/",
  },
};

export async function getSession() {
  // App Router (Next 15) requires awaiting cookies()
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}


