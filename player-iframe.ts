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

import { Renderer } from "./renderer";
import * as types from "./types";

if (!parent) {
  throw new Error("Can not open this player directly.");
}

let presentation: types.Presentation;
let renderer: types.SlyeRenderer;
let active: number;

window.addEventListener("message", async e => {
  if (e.data[0] !== "{") return;
  let data;
  try {
    data = JSON.parse(e.data);
    if (!data.slye) return;
  } catch (e) { return; }

  switch (data.type) {
    case "init":
      if (renderer) renderer.dispose();
      active = 0;
      presentation = data.presentation;
      // An empty init message will only dispose renderer.
      if (!presentation) return;
      renderer = new Renderer(presentation);
      await renderer.init();
      renderer.setSize(innerWidth, innerHeight);
      document.body.innerHTML = "";
      document.body.appendChild(renderer.canvas);
      break;
    case "goto":
      renderer.goTo(data.step);
      break;
  }
});

function goToNext() {
  if (!renderer) return;
  active++;
  if (active === presentation.order.length) {
    active = 0;
  }
  renderer.goTo(presentation.order[active]);
}

function goToPrev() {
  if (!renderer) return;
  active--;
  if (active === -1) {
    active = presentation.order.length - 1;
  }
  renderer.goTo(presentation.order[active]);
}

// DOM event handlers

function keydown(event) {
  if (!renderer) return;
  if (event.keyCode === 9 ||
    (event.keyCode >= 32 && event.keyCode <= 34) ||
    (event.keyCode >= 37 && event.keyCode <= 40)) {
    event.preventDefault();
  }
}

function keyup(event) {
  if (!renderer) return;
  switch (event.keyCode) {
    case 33: // pg up
    case 37: // left
    case 38: // up
      goToPrev();
      break;
    case 9:  // tab
    case 32: // space
    case 34: // pg down
    case 39: // right
    case 40: // down
      goToNext();
      break;
  }
  keydown(event);
}

function touchstart(event) {
  if (!renderer) return;
  if (event.touches.length === 1) {
    const x = event.touches[0].clientX;
    const width = innerWidth * 0.3;
    if (x < width) {
      goToPrev();
    } else if (x > innerWidth - width) {
      goToNext();
    }
  }
}

function handleResize() {
  if (!renderer) return;
  renderer.setSize(innerWidth, innerHeight);
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);
document.addEventListener("touchstart", touchstart);
window.addEventListener("resize", handleResize);

// Render

function render(time) {
  if (renderer) renderer.render(time);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
