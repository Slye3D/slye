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

import * as THREE from 'three/build/three.module';

if (!global.__scene__) {
  global.__scene__		=	new THREE.Scene();
  global.__renderers__ 	= {};
}

export default {
  scene: global.__scene__,
  createRenderer(name, w, h, far = 1000, near = 0.1, fov = 75) {
    if (global.__renderers__[name]) { return; }
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);

    const camera	= new THREE.PerspectiveCamera(fov, w / h, near, far);
    global.__renderers__[name] = {
      renderer,
      camera
    };
  },
  render(name) {
    if (!global.__renderers__[name]) { return; }
    const { renderer, camera } = global.__renderers__[name];
    return renderer.render(global.__scene__, camera);
  },
  resize(name, w, h) {
    if (!global.__renderers__[name]) { return; }
    const { renderer, camera } = global.__renderers__[name];
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
  },
  renderer(name) {
    if (!global.__renderers__[name]) { return; }
    return global.__renderers__[name].renderer;
  },
  camera(name) {
    if (!global.__renderers__[name]) { return; }
    return global.__renderers__[name].camera;
  },
  dom(name) {
    if (!global.__renderers__[name]) { return; }
    return global.__renderers__[name].renderer.domElement;
  },
  intersects(name, event, element, width) {
		// TODO:30 rewrite with respect to elements and steps
    if (!global.__renderers__[name]) { return; }
    let mouse		= new THREE.Vector2(),
			 raycaster = new THREE.Raycaster(),
			 { camera }	= global.__renderers__[name];
    element = element || document.body;
    width	= width || element.offsetWidth;
    const	{ offsetLeft, offsetTop } = element;
    mouse.x	= ((event.clientX - offsetLeft) / width) * 2 - 1;
    mouse.y = -((event.clientY - offsetTop) / width) * 2 - 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(global.__scene__.children);
    if (intersects.length == 0) { return; }
    return intersects[0].object;
  },
  getObjectByUUID(uuid) {
    return global.__scene__.getObjectByProperty('uuid', uuid);
  }
};
