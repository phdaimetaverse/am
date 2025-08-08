"use client";
import dynamic from "next/dynamic";

const ClientScene = dynamic(() => import("./scene-client"), { ssr: false });

export default function ClientSceneLoader({ name }: { name: string }) {
  return <ClientScene name={name} />;
}


