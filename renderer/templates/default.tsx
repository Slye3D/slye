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

import { SlyeTemplate } from 'SDK';
import { Scene, Viewport } from 'SDK/API/Renderer';
import * as THREE from 'three';
import Mirror from 'src/three_plugins/Mirror';
import Typer from 'src/SDK/Typer';

class Template extends SlyeTemplate {
  init() {
		// return
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

    const geometry	= new THREE.BoxGeometry(10, 10, 10);
    const material	= new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube		= new THREE.Mesh(geometry, material);
    Scene.add(cube);
		//
		// var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
		// var floorMesh = new THREE.Mesh( floorGeometry,new THREE.MeshBasicMaterial( {
		// 	 color: 0x000000,
		// 	 opacity:0.8,
		// 	 transparent: true
		//  } ) );
		// // var floorMesh = new THREE.Mesh( floorGeometry, floorMat);
		// floorMesh.receiveShadow = true;
		// floorMesh.rotation.x = -Math.PI / 2.0;
		// Scene.add( floorMesh );
		//
		// var WIDTH = window.innerWidth;
		// var HEIGHT = window.innerHeight;
		// var groundMirror = new Mirror( 2000, 2000, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x777777 } );
		// groundMirror.rotateX( - Math.PI / 2 );
		// groundMirror.position.y = -0.01
		// Scene.add( groundMirror );

    Viewport.renderer.setClearColor(0xffffff);
    Viewport.renderer.physicallyCorrectLights = true;
    Viewport.renderer.antialias = true;
    Viewport.renderer.gammaInput = true;
    Viewport.renderer.gammaOutput = true;
    Viewport.renderer.shadowMap.enabled = true;
    Viewport.renderer.toneMapping = THREE.ReinhardToneMapping;

    global.__camera__.position.set(0, 3, 55);
  }
}

export default Template;
