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

import React, { Component } from "react";
import * as types from "./types";

export interface PlayerProps {
  onClose(): void;
  presentation: types.Presentation;
}

export class Player extends Component<PlayerProps, {}> {
  // Reference to player DOM object.
  playerDiv: HTMLDivElement;
  private iFrame: HTMLIFrameElement;

  componentWillMount() {
    this.iFrame = document.createElement("iframe");
    this.iFrame.src = "/player.html";
  }

  componentWillUnmount() {
    // Send dispose event to iFrame
    this.iFrame.contentWindow.postMessage(JSON.stringify({
      slye: true,
      type: "dispose"
    }), "*");
  }

  shouldComponentUpdate() {
    // No need to update component at this point.
    return false;
  }

  handleRef = async playerDiv => {
    this.playerDiv = playerDiv;
    if (!playerDiv) return;
    playerDiv.appendChild(this.iFrame);
    setTimeout(() => {
      this.iFrame.contentWindow.postMessage(JSON.stringify({
        slye: true,
        type: "init",
        presentation: this.props.presentation
      }), "*");
    }, 750);
  }

  render() {
    return (
      <div className="player" ref={ this.handleRef } />
    );
  }
}
