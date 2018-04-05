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

export interface PointLightProps {
  color: number;
  intensity: number;
  distance: number;
  decay: number;
}

export function PointLight(props: PointLightProps) {
  return new THREE.PointLight(props.color, props.intensity, props.distance,
    props.decay);
}
