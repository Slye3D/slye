import * as THREE from "three";

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
