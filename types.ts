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
  owner: User;
  steps: {
    [key: string]: Step
  };
  created: Date;
  updated: Date;
  order: string[];
}

export type Axis = "x" | "y" | "z";

export type StepVec3Props = "position" | "orientation";

export interface User {
  displayName: string;
  photoURL: string;
  uid: string;
}

export interface SlyeRenderer {
  canvas: HTMLCanvasElement;
  active: string;
  init(): Promise<void>;
  setSize(width: number, height: number): void;
  render(time: number): void;
  goTo(id: string, duration?: number): void;
  dispose(): void;
}

export interface PresentationInfo {
  id: string;
  thumbnail: string;
  data: Presentation;
}
