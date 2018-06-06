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
