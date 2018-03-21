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

import API, { SlyeTemplate } from 'SDK';
import { Scene, Viewport } from 'SDK/API/Renderer';
import { registerTemplate } from 'SDK/API/Template';
import * as THREE from 'three';

class Blank extends SlyeTemplate {
  init() {
    Scene.fog = new THREE.FogExp2(0xffffff, 0.001);
    let bulbLight,
      hemiLight;
		// lights
    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
    bulbLight.power = 50000;
    bulbLight.position.set(0, 50, -50);
    bulbLight.castShadow = true;
    Scene.add(bulbLight);

    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
    bulbLight.power = 50000;
    global.bulbLight = bulbLight;
    bulbLight.position.set(0, 50, 50);
    bulbLight.castShadow = true;
    Scene.add(bulbLight);

    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
    bulbLight.power = 50000;
    global.bulbLight = bulbLight;
    bulbLight.position.set(-50, 50, -50);
    bulbLight.castShadow = true;
    Scene.add(bulbLight);

    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);
    bulbLight.power = 50000;
    global.bulbLight = bulbLight;
    bulbLight.position.set(-50, 50, 50);
    bulbLight.castShadow = true;
    Scene.add(bulbLight);


    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    Scene.add(hemiLight);

    Viewport.renderer.setClearColor(0x272727);
    Viewport.renderer.physicallyCorrectLights = true;
    Viewport.renderer.antialias = true;
    Viewport.renderer.gammaInput = true;
    Viewport.renderer.gammaOutput = true;
    Viewport.renderer.shadowMap.enabled = true;
    Viewport.renderer.toneMapping = THREE.ReinhardToneMapping;

    global.__camera__.position.set(0, 3, 55);
  }
}

registerTemplate('blank@slye', 'Blank', Blank);
