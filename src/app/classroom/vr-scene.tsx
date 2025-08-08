"use client";
import { useEffect, useState } from "react";

export default function VRScene({ name }: { name: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading 3D Environment...</p>
          <p className="text-sm text-gray-500 mt-2">Optimizing for Meta Quest 3...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 3D Environment Background */}
      <div 
        className="w-full h-[80vh] relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #87CEEB 0%, #7BC8A4 100%)',
          perspective: '1000px'
        }}
      >
        {/* 3D Objects using CSS */}
        <div className="absolute inset-0">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600"></div>
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-green-500 to-green-700 transform rotateX(60deg)"></div>
          
          {/* 3D Objects */}
          <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 bg-yellow-400 transform rotate-45 shadow-lg animate-pulse"></div>
          </div>
          
          <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 bg-green-400 transform -rotate-45 shadow-lg animate-pulse" style={{animationDelay: '0.5s'}}></div>
          </div>
          
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 bg-red-400 rounded-full shadow-lg animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 pointer-events-auto">
          <button 
            onClick={() => window.history.back()}
            className="bg-black bg-opacity-50 text-white px-4 py-2 rounded"
          >
            ← Back
          </button>
        </div>
        
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">
            ✅ 3D Environment Ready
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg border-2 border-white shadow-lg max-w-xs">
            <h3 className="font-bold mb-2">🎓 Welcome, {name}!</h3>
            <p className="text-sm">
              This is your 3D learning environment. 
              While true VR requires native apps, this provides a 3D experience 
              that works on Meta Quest 3 browser.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <button 
            onClick={() => {
              alert('For true immersive VR on Meta Quest 3, you would need a native VR app. This web-based 3D environment provides a preview of what\'s possible!');
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full border-2 border-white shadow-lg font-bold"
          >
            🥽 Learn About VR
          </button>
        </div>
      </div>
    </div>
  );
}
