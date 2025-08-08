"use client";
import { useState } from "react";
import VRScene from "./vr-scene";

export default function SceneClient({ name }: { name: string }) {
  const [showVR, setShowVR] = useState(false);

  if (showVR) {
    return (
      <div className="min-h-screen">
        <VRScene name={name} />
        <div className="absolute top-4 left-4">
          <button 
            onClick={() => setShowVR(false)}
            className="bg-black bg-opacity-50 text-white px-4 py-2 rounded"
          >
            ← Back to 3D View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="h-[80vh] bg-gradient-to-b from-blue-400 to-purple-600 relative">
        {/* Simple 3D-like interface */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to VR Classroom</h1>
            <p className="text-xl mb-8">Hello, {name}!</p>
            
            {/* 3D-like boxes */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="w-20 h-20 bg-yellow-400 transform rotate-45 shadow-lg animate-pulse"></div>
              <div className="w-20 h-20 bg-green-400 transform -rotate-45 shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-20 h-20 bg-blue-400 transform rotate-45 shadow-lg animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg">This is your virtual learning space</p>
              <p className="text-sm opacity-75">Click below to enter true VR mode</p>
            </div>
          </div>
        </div>
        
        {/* VR Mode Button */}
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={() => setShowVR(true)}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
          >
            🥽 Enter VR Mode
          </button>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-center gap-4">
        <a href="/dashboard" className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2">
          Back to dashboard
        </a>
        <button 
          onClick={() => {
            window.location.reload();
          }}
          className="rounded-md bg-blue-600 text-white px-4 py-2"
        >
          Reload Scene
        </button>
      </div>
    </div>
  );
}


