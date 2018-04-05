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

export interface BoxProps {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  material?: THREE.Material;
}

export function Box(props: BoxProps): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(props.width, props.height, props.depth,
                                         props.widthSegments, props.heightSegments,
                                         props.depthSegments);
  return new THREE.Mesh(geometry, props.material);
}
