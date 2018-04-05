/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import * as THREE from "three";

export type Element = (props: object) => null | THREE.Object3D;

export function S(element: Element, props: object, ...childrens) {
  const mesh = element(props);
  if (mesh) {
    for (let i = 0; i < childrens.length; ++i) {
      if (!childrens[i]) continue;
      mesh.add(childrens[i]);
    }
  }
  return mesh;
}

export * from "./geometries";
export * from "./lights";
