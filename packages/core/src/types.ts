export type UserRole = 'student' | 'instructor' | 'admin';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface AvatarState {
  userId: string;
  name: string;
  position: Vector3;
  rotationY: number;
  muted: boolean;
  handRaised: boolean;
}

export interface WhiteboardStroke {
  id: string;
  color: string;
  width: number;
  points: number[]; // [x0,y0,x1,y1,...]
  userId: string;
  ts: number;
}

export interface SlideDeckState {
  slideUrls: string[];
  index: number;
}

