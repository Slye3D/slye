export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Step {
  text: string;
  position: Vec3;
  orientation: Vec3;
}

export type Axis = "x" | "y" | "z";

export type StepVec3Props = "position" | "orientation";
