import React, { Component } from "react";
import * as types from "./types";

export interface PlayerProps {
  onClose(): void;
  steps: types.Step[]
}

export class Player extends Component<PlayerProps, {}> {
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

  handleClose() {
    this.props.onClose();
  }

  handleNext() {
    // TODO Go to next step
  }

  handlePrev() {
    // TODO Go to previous step
  }

  render() {
    return (
      <div id="player" />
    );
  }
}
