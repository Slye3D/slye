import * as THREE from "three";
import * as types from "./types";

export function createResolvable() {
  let methods;
  const promise = new Promise((resolve, reject) => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods);
}

export async function loadFontAsync(src) {
  const loader = new THREE.FontLoader();
  const resolvable = createResolvable();
  let font;
  loader.load(src, (f) => {
    font = f;
    resolvable.resolve();
  });
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
    orientation: { ...step.orientation }
  };
}

export function stepDeg2Rad(step: types.Step): types.Step {
  step = cloneStep(step);
  step.orientation.x = THREE.Math.degToRad(step.orientation.x);
  step.orientation.y = THREE.Math.degToRad(step.orientation.y);
  step.orientation.z = THREE.Math.degToRad(step.orientation.z);
  return step;
}

export function emptyStep(text = ""): types.Step {
  return {
    text,
    position: { x: 0, y: 0, z: 0 },
    orientation: { x: 0, y: 0, z: 0 }
  };
}

export function randomString(): string {
  return Math.random().toString(36).substring(7);
}
