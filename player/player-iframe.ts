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

import { Renderer } from "../renderer";
import * as types from "../types";

if (!parent) {
  throw new Error("Can not open this player directly.");
}

let renderer: types.SlyeRenderer;

window.addEventListener("message", async e => {
  const data = JSON.parse(e.data);
  switch (data.type) {
    case "init":
      if (renderer) renderer.dispose();
      renderer = new Renderer(data.presentation);
      await renderer.init();
      renderer.setSize(innerWidth, innerHeight);
      document.body.appendChild(renderer.canvas);
      break;
    case "goto":
      renderer.goTo(data.step);
      break;
  }
});
