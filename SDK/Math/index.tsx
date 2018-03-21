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

const GR  = 1.61803398875;

function calculateDistance(windowWidth, windowHeight, width, height, FOV = 75, NEAR = 0.1) {
  const Dw = windowWidth,
    Dh = windowHeight;

  const FD = height / 2;
  const DH = width / 2;
  const OB = NEAR;
  const AB = Math.tan((FOV / 2) * Math.PI / 180);
  const BI = AB * Dw / Dh;
  const BJ = GR * BI / (1 + GR);

  const DHoverFD = DH / FD;
  let BE = BJ / DHoverFD;

  if (BE > (AB - 30)) {
    BE = GR * AB / (1 + GR);
    BJ = BE * DHoverFD;
  }

  return OB * FD / BE;
}

function findCameraPosition(position, rotation, distance) {
  const { x: rx, y: ry, z: rz } = rotation;

  const target  = new THREE.Vector3(0, 0, distance);
  target.applyEuler(new THREE.Euler(rx, ry, rz, "XYZ"));
  target.add(position);

  return target;
}

// from THREE.js
const generateUUID = (function() {
  // http://www.broofa.com/Tools/Math.uuid.htm

  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  let uuid   = new Array(36),
    rnd = 0,
    r;

  return function generateUUID() {
    for (let i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) {
        uuid[i] = "-";
      } else if (i === 14) {
        uuid[i] = "4";
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
        r   = rnd & 0xf;
        rnd >>= 4;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join("");
  };
}());

export default {
  calculateDistance,
  findCameraPosition,
  generateUUID
};

export {
    calculateDistance
  ,  findCameraPosition
  ,  generateUUID
};
