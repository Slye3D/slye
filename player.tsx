import React, { Component } from "react";
import * as THREE from "three";
import * as types from "./types";
import { loadFontAsync } from "./util";

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
      if ( x < width ) {
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
    const WMax = 800;
    // Like WMax
    const HMax = 200;
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
  }

  handleResize = () => {
    this.setDistance();
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.camera.aspect = offsetWidth / offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(offsetWidth, offsetHeight);
    // TODO Go to current step!
  }

  handleClose() {
    this.props.onClose();
  }

  handleNext() {
    // TODO Go to next step
  }

  handlePrev() {
    // TODO Go to previous step
  }

  init = () => {
    this.scene = new THREE.Scene();
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.camera = new THREE.PerspectiveCamera(FOV, offsetWidth / offsetHeight, NEAR, FAR);
    this.camera.position.z = 100;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.playerDiv.appendChild(this.renderer.domElement);
    // Lights
    const lights = [];
    lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
    lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

    lights[ 0 ].position.set( 0, 200, 0 );
    lights[ 1 ].position.set( 100, 200, 100 );
    lights[ 2 ].position.set( - 100, - 200, - 100 );

    this.scene.add( lights[ 0 ] );
    this.scene.add( lights[ 1 ] );
    this.scene.add( lights[ 2 ] );

    this.threeRender();
  }

  threeRender = () => {
    this.renderer.render(this.scene, this.camera);
    if (this.playerDiv) requestAnimationFrame(this.threeRender);
  }

  async drawSteps() {
    const { steps } = this.props;
    const font = await FONT;
    for (let i = 0; i < steps.length;++i) {
      const step = steps[i];
      const geometry = new THREE.TextGeometry(step.text, {
        font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      });
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = step.position.x;
      mesh.position.y = step.position.y;
      mesh.position.z = step.position.z;
      mesh.rotation.x = step.orientation.x;
      mesh.rotation.y = step.orientation.y;
      mesh.rotation.z = step.orientation.z;
      console.log(mesh);
      this.scene.add(mesh);
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
