import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metaverse Learning",
  description: "A VR-enabled learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full border-b border-black/10 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold">Metaverse Learning</a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/dashboard" className="hover:underline">Dashboard</a>
              <a href="/classroom" className="hover:underline">Classroom</a>
              <form action="/api/logout" method="post">
                <button className="hover:underline" type="submit">Logout</button>
              </form>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
