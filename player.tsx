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
import * as screenfull from "screenfull";
import { Renderer } from "./renderer";
import * as types from "./types";

export interface PlayerProps {
  onClose(): void;
  presentation: types.Presentation;
}

export class Player extends Component<PlayerProps, {}> {
  // Reference to player DOM object.
  playerDiv: HTMLElement;
  renderer: types.SlyeRenderer;
  active = 0;

  // DOM handlers
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
      // TODO s/window.innerWidth/playerDiv.offsetWidth/
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
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
    document.addEventListener("touchstart", this.touchstart);
    // TODO listen to size changes of playerDiv
    window.addEventListener("resize", this.handleResize);
    screenfull.on("change", this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydown);
    document.removeEventListener("keyup", this.keyup);
    document.removeEventListener("touchstart", this.touchstart);
    window.removeEventListener("resize", this.handleResize);
    screenfull.off("change", this.handleResize);
  }

  shouldComponentUpdate() {
    // No need to update component at this point.
    return false;
  }

  // Actions
  handleResize = () => {
    const { offsetWidth, offsetHeight } = this.playerDiv;
    this.renderer.setSize(offsetWidth, offsetHeight);
  }

  handleNext = () => {
    this.active++;
    if (this.active === this.props.presentation.order.length) {
      this.active = 0;
    }
    this.renderer.goTo(this.props.presentation.order[this.active]);
  }

  handlePrev = () => {
    this.active--;
    if (this.active === -1) {
      this.active = this.props.presentation.order.length - 1;
    }
    this.renderer.goTo(this.props.presentation.order[this.active]);
  }

  handleClose() {
    this.props.onClose();
  }

  componentWillMount() {
    this.renderer = new Renderer(this.props.presentation);
  }

  handleRef = async playerDiv => {
    this.playerDiv = playerDiv;
    if (!playerDiv) return;
    await this.renderer.init();
    this.handleResize();
    this.renderer.goTo(this.props.presentation.order[0], 0);
    playerDiv.appendChild(this.renderer.canvas);
    // Show player with a fade effect
    new TWEEN.Tween(playerDiv.style)
      .to({ opacity: 1 }, 500)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();
    //  Start rendering loop
    const render = time => {
      if (!this.playerDiv) return;
      this.renderer.render(time);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  render() {
    return (
      <div className="player" ref={ this.handleRef } style={{ opacity: 0 }} />
    );
  }
}
