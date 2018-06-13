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

/**
 * This file contains Renderer class which renders a Slye presentation
 * using Three.js.
 * It is implemented to be used for:
 * 1) Player
 * 2) Thumbnail Generator
 */

import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import * as types from "./types";
import * as util from "./util";

// Constants
export const NEAR = 1;
export const FAR = 2000000;
export const FOV = 70;
export const GR = 1.61803398875;
export const FONT = "assets/optimer_regular.typeface.json";

interface StepWithSize extends types.Step {
  width: number;
  height: number;
}

export class Renderer implements types.SlyeRenderer {
  canvas: HTMLCanvasElement;
  active: string;
  private steps: Map<string, StepWithSize>;
  private width = 256;
  private height = 256;
  // THREE.js related data.
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.Renderer;

  constructor(private presentation: types.Presentation) {}

  private initThree() {
    this.scene = new THREE.Scene();
    const aspect = this.width / this.height;
    this.camera = new THREE.PerspectiveCamera(FOV, aspect, NEAR, FAR);
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.canvas = this.renderer.domElement;
    // Lights
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 2000, 0);
    lights[1].position.set(1000, 2000, 1000);
    lights[2].position.set(-1000, -2000, - 1000);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  }

  private async drawStep(step: types.Step) {
    if (!step.text.trim()) return null;
    const font = await util.loadFontAsync(FONT);
    const geometry = new THREE.TextGeometry(step.text, {
      font,
      size: 10,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 0.3,
      bevelSegments: 3
    });
    const material = new THREE.MeshPhongMaterial({
      color: 0xeee037,
      emissive: 0x000,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = step.position.x;
    mesh.position.y = step.position.y;
    mesh.position.z = step.position.z;
    mesh.rotation.x = step.orientation.x;
    mesh.rotation.y = step.orientation.y;
    mesh.rotation.z = step.orientation.z;
    this.scene.add(mesh);
    // Compute width/height of geometry
    geometry.computeBoundingBox();
    const boundingBox = geometry.boundingBox;
    const width = boundingBox.max.x - boundingBox.min.x;
    const height = boundingBox.max.y - boundingBox.min.y;
    return { width, height };
  }

  private handleSizeChange() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    if (this.active) {
      this.goTo(this.active, 750);
    }
  }

  // Public APIs
  async init() {
    this.initThree();
    if (this.presentation.order.length === 0) return;

    this.steps = new Map();
    for (const key of this.presentation.order) {
      if (this.presentation.steps[key]) {
        const step = util.stepDeg2Rad(this.presentation.steps[key]);
        const size = await this.drawStep(step);
        this.steps.set(key, Object.assign(step, size));
      } else {
        throw new Error("Corrupted presentation object.");
      }
    }
  }

  setSize(width: number, height: number) {
    if (!this.width || !this.height) {
      throw new Error("setSize() should be called after init()");
    }
    this.width = width;
    this.height = height;
    this.handleSizeChange();
  }

  render(time) {
    this.renderer.render(this.scene, this.camera);
    this.camera.updateProjectionMatrix();
    TWEEN.default.update(time);
  }

  goTo(id: string, duration = 1500) {
    if (!this.steps) return;
    this.active = id;
    const step = this.steps.get(id);
    // TODO I don't like this code.
    const { x: ox, y: oy, z: oz } = step.orientation;
    // Find distance between camera and text.
    const vFov = THREE.Math.degToRad(FOV);
    const farHeight = 2 * Math.tan(vFov / 2) * FAR;
    const farWidth = farHeight * this.camera.aspect;
    // TODO If by setting this distance height of element become
    // greater than screen we should user another algorithm to
    // fit text in centre of screen.
    const distance = (FAR * step.width / farWidth) / (2 / 3);
    // Align camera so it'll focus on centre of text geometry.
    const alignX = step.width / 2;
    const alighY = step.height / 2;
    const position = new THREE.Vector3(alignX, alighY, distance);
    const e = new THREE.Euler(ox, oy, oz, "XYZ" );
    position.applyEuler(e);
    position.add(util.toThreeVec3(step.position));

    if (duration === 0) {
      this.camera.position.x = position.x;
      this.camera.position.y = position.y;
      this.camera.position.z = position.z;
      this.camera.rotation.x = step.orientation.x;
      this.camera.rotation.y = step.orientation.y;
      this.camera.rotation.z = step.orientation.z;
      return;
    }

    new TWEEN.Tween(this.camera.position)
      .to(position, duration)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();

    new TWEEN.Tween(this.camera.rotation)
      .to(step.orientation, duration)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();
  }
}
