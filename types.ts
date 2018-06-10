/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2018 Parsa Ghadimi. All Rights Reserved.
 *       Licence: MIT License
 */

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

export interface Presentation {
  // TODO owner...
  steps: Step[];
}

export type Axis = "x" | "y" | "z";

export type StepVec3Props = "position" | "orientation";
