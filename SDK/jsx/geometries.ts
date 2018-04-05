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

function Mesh(object3D, material: THREE.Material): THREE.Object3D {
  if (!material) return object3D;
  return new THREE.Mesh(object3D, material);
}


export interface BoxProps {
  width?: number;
  height?: number;
  depth?: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
  material?: THREE.Material;
}

export function Box(props: BoxProps) {
  const geometry = new THREE.BoxGeometry(props.width, props.height, props.depth,
    props.widthSegments, props.heightSegments,
    props.depthSegments);
  return Mesh(geometry, props.material);
}


export interface GroupProps {}

export function Group(props: GroupProps) {
  return new THREE.Group();
}


export interface CircleProps {
  radius?: number;
  segments?: number;
  thetaStart?: number;
  thetaLength?: number;
  material?: THREE.Material;
}

export function Circle(props: CircleProps) {
  const geometry = new THREE.CircleGeometry(props.radius, props.segments, props.thetaStart,
    props.thetaLength);
  return Mesh(geometry, props.material);
}


export interface ConeProps {
  radius?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded?: boolean;
  thetaStart?: number;
  thetaLength?: number;
  material?: THREE.Material;
}

export function Cone(props: ConeProps) {
  const geometry = new THREE.ConeGeometry(props.radius, props.height, props.radialSegments,
    props.heightSegments, props.openEnded, props.thetaStart, props.thetaLength);
  return Mesh(geometry, props.material);
}


export interface CylinderProps {
  radiusTop?: number;
  radiusBottom?: number;
  height?: number;
  radialSegments?: number;
  heightSegments?: number;
  openEnded: boolean;
  thetaStart: number;
  thetaLength: number;
  material: THREE.Material;
}

export function Cylinder(props: CylinderProps) {
  const geometry = new THREE.CylinderGeometry(props.radiusTop, props.radiusBottom, props.height,
    props.radialSegments, props.heightSegments, props.openEnded, props.thetaStart, props.thetaLength);
  return Mesh(geometry, props.material);
}
