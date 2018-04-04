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
import "babel-polyfill";
import * as SDK from "./SDK";

const pr = new SDK.API.Presentation();
const step = new SDK.API.Step();
pr.insertStep(step);
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new SDK.WebGLRenderer(pr, width, height);
document.body.appendChild(renderer.renderer.domElement);
window.addEventListener("resize", () => {
  renderer.width = window.innerWidth;
  renderer.height = window.innerHeight;
});
