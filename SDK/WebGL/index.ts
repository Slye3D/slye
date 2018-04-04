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
import { Presentation } from "../API";
import { createRenderer } from "./loop";
import { renderer } from "./renderer";
import { createScene } from "./scene";

export class WebGLRenderer {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
  requestAnimationFrame: () => void;

  set width(width: number) {
    this.cWidth = width;
    this.onWindowResize();
  }

  get width(): number {
    return this.cWidth;
  }

  set height(height: number) {
    this.cHeight = height;
    this.onWindowResize();
  }

  get height(): number {
    return this.cHeight;
  }

  private onWindowResize(): void {
    this.camera.aspect = this.cWidth / this.cHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.cWidth, this.cHeight);
  }

  constructor(presentation: Presentation, private cWidth, private cHeight) {
    const { scene, camera } = createScene(cWidth, cHeight);
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer(cWidth, cHeight);
    this.requestAnimationFrame = createRenderer(this.renderer, this.scene,
                                                this.camera, presentation);
  }
}
