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

import { PerspectiveCamera, WebGLRenderer } from "three";
import { calculateDistance, findCameraPosition } from "../../Math";
import { Path } from "../Fileformat";
import { getStep } from "../Fileformat/_Steps";

global.__thumbnailsRenderer__ 	= new WebGLRenderer({ alpha: true });
global.__renderThumbnails__		= false;
const thumbnails	= global.__presentation__.__cache__.thumbnails;
const scene 		= global.__scene__;
let distance;

function updateCamera(stepUUID) {
  const step		= getStep(stepUUID);
  if (!step) { return thumbnails[step]	= null; }
  const pos			= findCameraPosition(step.position, step.rotation, distance);
  thumbnails[stepUUID][0].rotation.copy(step.rotation);
  thumbnails[stepUUID][0].position.copy(pos);
}

function init(stepUUID) {
  if (thumbnails[stepUUID]) { return; }
  const camera		= new PerspectiveCamera(75, global.__tW__ / global.__tH__, 0.1, 250);
  thumbnails[stepUUID] = [camera, null];
  updateCamera(stepUUID);

  // TODO: Effect events like onStepRemoved and etc...
}

function enableRenderer() {
  global.__renderThumbnails__	= true;
}

function disableRenderer() {
  global.__renderThumbnails__	= false;
}

function setDom(stepUUID, el) {
  thumbnails[stepUUID][1] = el;
}

function getThumbnailCanvas() {
  return global.__thumbnailsRenderer__.domElement;
}

function setThumbnailsSize(width, height, margin) {
  global.__tW__	= width;
  global.__tH__	= height;
  global.__tM__	= margin;
  distance	= calculateDistance(
         global.__tW__
     ,	global.__tH__
     ,	900
     ,	700
   );
  const n = Object.keys(thumbnails).length;
  for (const key in thumbnails) {
     if (thumbnails[key])	   	{ updateCamera(key); }
  }
}

function setWrapperSize(width, height) {
  global.__thumbnailsRenderer__.setSize(width, height);
}

function setWrapperDom(domElement) {
  global.__thumbnailsWrapper__ = domElement;
}

function requestAnimationFrame() {
  if (!global.__renderThumbnails__) { return; }
  const path 	= Path.getPath();
  const w 		= global.__thumbnailsWrapper__;
  const width	= global.__tM__ + global.__tW__;
  const start	= Math.max(0, Math.floor(w.scrollLeft / width) - 1);
  const length	= Math.ceil(w.offsetWidth / width);
  const end		= Math.min(path.length, start + length + 1);

  const renderer = global.__thumbnailsRenderer__;
  renderer.setClearColor(0xffffff);
  renderer.setScissorTest(false);
  renderer.clear();

  renderer.setClearColor(0xe0e0e0);
  renderer.setScissorTest(true);

  for (let i = start; i < end; i++) {
    const left = width * i - w.scrollLeft;
    renderer.setViewport(left + global.__tM__, 19.25, global.__tW__, global.__tH__);
    renderer.setScissor(left + global.__tM__, 19.25, global.__tW__, global.__tH__);

    renderer.render(scene, thumbnails[path[i]][0]);
  }
}

export default {
  setThumbnailsSize,
  init,
  getThumbnailCanvas,
  updateCamera,
  enableRenderer,
  disableRenderer,
  requestAnimationFrame,
  setDom,
  setWrapperDom,
  setWrapperSize
};
export {
    setThumbnailsSize
  ,	init
  ,	getThumbnailCanvas
  ,	updateCamera
  ,	enableRenderer
  ,	disableRenderer
  ,	requestAnimationFrame
  ,	setDom
  ,	setWrapperDom
  ,	setWrapperSize
};
