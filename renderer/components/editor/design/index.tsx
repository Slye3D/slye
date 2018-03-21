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

import Fontkit from "fontkit";
import $ from "jquery";
import "jquery.nicescroll";
import Colors from "nice-color-palettes/500";
import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import "src/css/Design.css";
import { Configs } from "../../../../SDK/API/Fileformat";

let h;

class Color extends Component {
  render() {
    return (
      <div
        className="design-color"
        style={{
          background: this.props.color,
          width: this.props.size,
          height: this.props.size
        }}
      />
    );
  }
}

class Palette extends Component {
  componentDidMount() {
    this._ismounted = true;
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  constructor() {
    super();
    window.addEventListener("resize", () => {
      if (this._ismounted) { this.forceUpdate(); }
    });
  }

  onClick = () => {
    Configs.set("palette", this.props.colors);
    h && h();
  }

  render() {
    const s = (window.innerWidth - 200 - 4 * 15) / 15;
    return (
      <div className={`design-palette${this.props.isSelected ? " selected" : ""}`} onClick={this.onClick}>
        {this.props.colors.map((x, k) => <Color size={s} color={x} key={k} />)}
      </div>
    );
  }
}

class Design extends Component {
  niceScroll = (el) => {
    el && $(findDOMNode(el)).niceScroll();
  }

  constructor() {
    super();
    h = this.forceUpdate.bind(this);
    function fkOpenFont(fkFontPath) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fkFontPath, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function(e) {
          if (this.status == 200) {
            resolve(Fontkit.create(new Buffer(this.response)));
          }
        };
        xhr.send();
      });
    }

    fkOpenFont(`${__dirname}/public/fonts/NotoKufiArabic-Bold.ttf`).then(font => {
      const run = font.layout("سلام");
      console.log(run);
    });
  }

  getSelectedId() {
    const palette = Configs.get("palette");
    if (!palette) { return null; }
    for (let i = 0; i < Colors.length; i++) {
      if (Colors[i] == palette) {
        return i;
      }
    }
    return null;
  }

  render() {
    const selected = this.getSelectedId();
    return (
      <div className="page">
        <div className="design-arrow" />
        <div className="design-wrapper" ref={this.niceScroll}>
          {Colors.map((x, key) => <Palette isSelected={key == selected} colors={x} key={key} />)}
        </div>
      </div>
    );
  }
}

export default Design;
