import React, { Component } from "react";
import * as TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import * as types from "./types";
import { toThreeVec3, loadFontAsync } from "./util";

// Constants
export const NEAR = 1;
export const FAR = 2000000;
export const FOV = 70;
export const GR = 1.61803398875;
export const FONT = loadFontAsync("assets/optimer_regular.typeface.json");

export interface PlayerProps {
  onClose(): void;
  steps: types.Step[]
}

export class Player extends Component<PlayerProps, {}> {
  // Reference to player DOM object.
  playerDiv: HTMLElement;
  // THREE.js related data.
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
  // Current step.
  active: number;
  // Width and heights of each step.
  // Computed and drawSteps()
  widths = new Map<number, number>();
  heights = new Map<number, number>();

  keydown(event) {
    if (event.keyCode === 9 || 
      (event.keyCode >= 32 && event.keyCode <= 34) ||
      (event.keyCode >= 37 && event.keyCode <= 40)) {
      event.preventDefault();
    }
  }

  keyup = (event) => {
    switch (event.keyCode) {
      case 33: // pg up
      case 37: // left
      case 38: // up
        this.handlePrev();
        break;
      case 9:  // tab
      case 32: // space
      case 34: // pg down
      case 39: // right
      case 40: // down
        this.handleNext();
        break;
      case 27: // esc
        this.handleClose();
        break;
    }
    this.keydown(event);
  }

  touchstart = (event) => {
    if (event.touches.length === 1) {
      const x = event.touches[0].clientX;
      const width = window.innerWidth * 0.3;
      if (x < width) {
        this.handlePrev();
      } else if (x > window.innerWidth - width) {
        this.handleNext();
      }
    }
  }

  handleClose() {
    this.props.onClose();
  }

  componentWillMount() {
    // For debug
    window["player"] = this;
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
    document.addEventListener("touchstart", this.touchstart);
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("keyup", this.keyup);
    document.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("resize", this.handleResize);
  }

  shouldComponentUpdate() {
    // No need to update component at this point.
    return false;
  }

  handleResize = () => {
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.goTo(this.active, 750);
  }

  goTo = (target: number, time = 1500) => {
    this.active = target;
    const step = this.props.steps[target];
    const { x: ox, y: oy, z: oz } = step.orientation;
    // Find distance between camera and text.
    const vFov = THREE.Math.degToRad(FOV);
    const farHeight = 2 * Math.tan(vFov / 2) * FAR;
    const farWidth = farHeight * this.camera.aspect;
    const AE = GR * (farWidth / 2) / (1 + GR);
    const distance = FAR * this.widths.get(target) / AE;
    // Align camera so it'll focus on centre of text geometry.
    const alignX = this.widths.get(target) / 2;
    const alighY = this.heights.get(target) / 2;
    const position = new THREE.Vector3(alignX, alighY, distance);
		const e = new THREE.Euler(ox, oy, oz, 'XYZ' );
		position.applyEuler(e);
    position.add(toThreeVec3(step.position));

    new TWEEN.Tween(this.camera.position)
      .to(position, time)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();

    new TWEEN.Tween(this.camera.rotation)
      .to(step.orientation, time)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();
  };

  handleNext = () => {
    const t = (this.active + 1) % this.props.steps.length;
    this.goTo(t);
  }

  handlePrev = () => {
    if (this.active === 0) {
      return this.goTo(this.props.steps.length - 1);
    }
    const t = (this.active - 1) % this.props.steps.length;
    this.goTo(t);
  }

  init = () => {
    this.scene = new THREE.Scene();
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.camera = new THREE.PerspectiveCamera(FOV, offsetWidth / offsetHeight, NEAR, FAR);
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.playerDiv.appendChild(this.renderer.domElement);
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

    requestAnimationFrame(this.threeRender);
  }

  threeRender = (time) => {
    this.renderer.render(this.scene, this.camera);
    this.camera.updateProjectionMatrix();
    TWEEN.default.update(time);
    if (this.playerDiv) requestAnimationFrame(this.threeRender);
  }

  async drawSteps() {
    const { steps } = this.props;
    const font = await FONT;
    for (let i = 0; i < steps.length;++i) {
      const step = steps[i];
      if (!step.text.trim()) continue;
      const geometry = new THREE.TextGeometry(step.text, {
        font,
        size: 10,
        height: 2,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelSegments: 3
      });
      const material = new THREE.MeshPhongMaterial({
        color: 0xeee037,
        emissive: 0x000,
        side: THREE.DoubleSide,
        flatShading: true
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
      this.widths.set(i, width);
      this.heights.set(i, height);
    }
  }

  handleRef = async (player) => {
    this.playerDiv = player;
    if (player) {
      this.init();
      await this.drawSteps();
      this.goTo(0, 0);
      this.showPlayer();
    }
  }

  showPlayer() {
    new TWEEN.Tween(this.playerDiv.style)
      .to({ opacity: 1 }, 500)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();
  }

  render() {
    return (
      <div id="player" ref={ this.handleRef } style={{ opacity: 0 }} />
    );
  }
}
