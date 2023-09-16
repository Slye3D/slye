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

import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import * as types from "./types";

export function createResolvable() {
  let methods;
  const promise = new Promise((resolve, reject) => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods);
}

const fontCache = new Map<string, any>();
const loader = new FontLoader();
export async function loadFontAsync(src: string) {
  const resolvable = createResolvable();
  let font = fontCache.get(src);
  if (font) {
    resolvable.resolve();
  } else {
    loader.load(src, (f) => {
      font = f;
      fontCache.set(src, f);
      resolvable.resolve();
    });
  }
  await resolvable;
  return font;
}

export function toThreeVec3(vec: types.Vec3): THREE.Vector3 {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}

export function cloneStep(step: types.Step): types.Step {
  return {
    text: step.text,
    position: { ...step.position },
    orientation: { ...step.orientation },
  };
}

export function stepDeg2Rad(step: types.Step): types.Step {
  step = cloneStep(step);
  step.orientation.x = THREE.MathUtils.degToRad(step.orientation.x);
  step.orientation.y = THREE.MathUtils.degToRad(step.orientation.y);
  step.orientation.z = THREE.MathUtils.degToRad(step.orientation.z);
  return step;
}

export function emptyStep(text = ""): types.Step {
  return {
    text,
    position: { x: 0, y: 0, z: 0 },
    orientation: { x: 0, y: 0, z: 0 },
  };
}

export function randomString(): string {
  return Math.random().toString(36).substring(7);
}

export function delay(t: number): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, t);
  });
}
