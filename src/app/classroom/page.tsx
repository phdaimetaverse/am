import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import ClientSceneLoader from "./scene-loader";

// Allow TSX to recognize A-Frame custom elements
declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      "a-scene": any;
      "a-entity": any;
      "a-box": any;
      "a-sky": any;
      "a-plane": any;
      "a-text": any;
    }
  }
  
  // Declare AFRAME global object
  interface Window {
    AFRAME: any;
  }
}

export default async function ClassroomPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/login");
  }
  return <ClientSceneLoader name={session.user.name} />;
}


