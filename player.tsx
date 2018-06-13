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

import * as TWEEN from "@tweenjs/tween.js";
import React, { Component } from "react";
import * as types from "./types";

export interface PlayerProps {
  onClose(): void;
  presentation: types.Presentation;
}

export class Player extends Component<PlayerProps, {}> {
  // Reference to player DOM object.
  playerDiv: HTMLElement;
  renderer: types.SlyeRenderer;

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

  componentDidMount() {
    // For debug
    window["player"] = this;
    this.playerDiv.addEventListener("keydown", this.keydown);
    this.playerDiv.addEventListener("keyup", this.keyup);
    this.playerDiv.addEventListener("touchstart", this.touchstart);
    // TODO listen to size changes of playerDiv
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    this.playerDiv.removeEventListener("keydown", this.keydown);
    this.playerDiv.removeEventListener("keyup", this.keyup);
    this.playerDiv.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("resize", this.handleResize);
  }

  shouldComponentUpdate() {
    // No need to update component at this point.
    return false;
  }

  // Actions

  handleResize = () => {
    // TODO
  }

  handleNext = () => {
    // TODO
  }

  handlePrev = () => {
    // TODO
  }

  handleClose() {
    this.props.onClose();
  }

  handleRef = async player => {
    this.playerDiv = player;
    if (player) {
      // TODO
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
