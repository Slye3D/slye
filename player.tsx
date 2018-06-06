import React, { Component } from "react";
import * as types from "./types";

export interface PlayerProps {
  onExit(): void;
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

  keyup(event) {
    switch (event.keyCode) {
      case 33: // pg up
      case 37: // left
      case 38: // up
        // TODO call prev
        break;
      case 9:  // tab
      case 32: // space
      case 34: // pg down
      case 39: // right
      case 40: // down
        // TODO call next
        break;
    }
    this.keydown(event);
  }

  touchstart(event) {
    if (event.touches.length === 1) {
      const x = event.touches[0].clientX;
      const width = window.innerWidth * 0.3;
      if ( x < width ) {
        // TODO call prev
      } else if (x > window.innerWidth - width) {
        // TODO call next
      }
      //if (result) {
        //event.preventDefault();
      //}
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
    document.addEventListener("touchstart", this.touchstart.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydown.bind(this));
    document.removeEventListener("keyup", this.keyup.bind(this));
    document.removeEventListener("touchstart", this.touchstart.bind(this));
  }

  render() {
    return (
      <div id="player" />
    );
  }
}
