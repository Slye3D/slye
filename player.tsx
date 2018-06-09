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
  // Distance between camera and step.
  distance: number;
  playerDiv: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
  active: number;
  widths = new Map<number, number>();

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
      //if (result) {
        //event.preventDefault();
      //}
    }
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

  // TODO Write documentations for this function. :/
  setDistance() {
    // TODO Get WMax and HMax from steps.
    // WMax is maximum width we have in all steps.
    const WMax = 400;
    // Like WMax
    const HMax = 30;
    // D=Display=<w:width, h: height>
    const Dw = this.playerDiv.offsetWidth;
    const Dh = this.playerDiv.offsetHeight;
    const FD = HMax / 2;
    const DH = WMax / 2;
    const OB = NEAR;
    const AB = Math.tan((FOV / 2) * Math.PI / 180)
    const BI = AB * Dw / Dh;
    let BJ = GR * BI / (1 + GR);
    const BJoverBE = DH / FD;
    let BE = BJ / BJoverBE;
    if (BE > (AB - 30)) {
      BE = GR * AB / (1 + GR);
      BJ = BE * BJoverBE;
    }
    const OD = OB * FD / BE;
    this.distance = OD;
    console.log(this.distance);
  }

  handleResize = () => {
    this.setDistance();
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(offsetWidth, offsetHeight);
    this.goTo(this.active);
  }

  handleClose() {
    this.props.onClose();
  }

  goTo = (target: number, time = 1500) => {
    console.log("Go to", target);
    this.active = target;
    const step = this.props.steps[target];
    const { x: ox, y: oy, z: oz } = step.orientation;

    const alignX = this.widths.get(target) / 2;
    const position = new THREE.Vector3(alignX, 0, this.distance);
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
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.playerDiv.appendChild(this.renderer.domElement);
    // Lights
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, - 100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);

    requestAnimationFrame(this.threeRender);
    this.goTo(0);
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
        color: 0x156289,
        emissive: 0x072534,
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
      // Compute width of geometry
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      const width = boundingBox.max.x - boundingBox.min.x;
      this.widths.set(i, width);
    }
  }

  handleRef = (player) => {
    this.playerDiv = player;
    if (player) {
      this.setDistance();
      this.init();
      this.drawSteps();
    }
  }

  render() {
    return (
      <div id="player" ref={ this.handleRef } />
    );
  }
}
