import * as React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

export function ClassroomScene({ children }: { children?: React.ReactNode }) {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <gridHelper args={[20, 20]} />
      <OrbitControls />
      {children}
    </Canvas>
  );
}

export type AvatarRender = {
  id: string;
  name: string;
  position: [number, number, number];
  rotationY: number;
  muted?: boolean;
  handRaised?: boolean;
};

export function Avatars({ avatars }: { avatars: AvatarRender[] }) {
  return (
    <group>
      {avatars.map((a) => (
        <group key={a.id} position={a.position} rotation={[0, a.rotationY, 0]}>
          <mesh>
            <capsuleGeometry args={[0.4, 1.0, 4, 8]} />
            <meshStandardMaterial color={a.handRaised ? '#ffd166' : '#4cc9f0'} />
          </mesh>
          <Text position={[0, 1.4, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="bottom">
            {a.name}
          </Text>
        </group>
      ))}
    </group>
  );
}

