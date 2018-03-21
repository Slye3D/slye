/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three/build/three.module';

import DDSLoader from 'src/three_plugins/loaders/DDSLoader';
import MTLLoader from 'src/three_plugins/loaders/MTLLoader';
import OBJLoader from 'src/three_plugins/loaders/OBJLoader';

import Renderer, { Viewport } from 'SDK/API/Renderer';
import Events from 'SDK/API/Events';

class Preview extends Component {
  constructor() {
    super();

    const resizeHandler = () => {
      let x = 32 + 24;
      if (this.isFullScreen) { x *= 0; }
      Viewport.resizeRenderer(window.innerWidth, window.innerHeight - x);
    };
    window.addEventListener('resize', resizeHandler, false);
    resizeHandler();

    const render = function () {
      requestAnimationFrame(render);
      Renderer.requestAnimationFrame();
    };
    render();

    Events.on('fullscreenStateChanged', (v) => {
      console.log('x', v);
      this.isFullScreen = v;
      resizeHandler();
    });
  }


  render() {
    const Canvas = Viewport.getDom();
    return (
      <div
        id="preview"
        ref={(el) => { el && !el.childElementCount && el.appendChild(Canvas); }}
      />
    );
  }
}

export default Preview;
