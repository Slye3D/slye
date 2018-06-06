import React, { Component } from "react";
import * as types from "./types";

// Constants
export const NEAR = 1;
export const FAR = 2000000;
export const FOV = 70;
export const GR = 1.61803398875;

export interface PlayerProps {
  onClose(): void;
  steps: types.Step[]
}

export class Player extends Component<PlayerProps, {}> {
  // Distance between camera and step.
  distance: number;
  playerDiv: HTMLElement;

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
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("keyup", this.keyup);
    document.removeEventListener("touchstart", this.touchstart);
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

  handleClose() {
    this.props.onClose();
  }

  handleNext() {
    // TODO Go to next step
  }

  handlePrev() {
    // TODO Go to previous step
  }

  handleRef = (player) => {
    this.playerDiv = player;
    this.setDistance();
  }

  render() {
    return (
      <div id="player" ref={ this.handleRef } />
    );
  }
}
