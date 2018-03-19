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

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import * as THREE from 'three/build/three.module'

import DDSLoader from 'src/three_plugins/loaders/DDSLoader'
import MTLLoader from 'src/three_plugins/loaders/MTLLoader'
import OBJLoader from 'src/three_plugins/loaders/OBJLoader'
import OrbitControls from 'src/three_plugins/controls/OrbitControls'
// import FirstPersonControls from 'src/three_plugins/controls/FirstPersonControls'
import Mirror from 'src/three_plugins/Mirror'
import Typer from 'src/SDK/Typer'

import {Tween, Easing, update} from 'es6-tween'

let TweenUpdate = update
class Presentation extends Component{
	constructor(){
		super()
		let v = (x,y,z) => new THREE.Vector3(x,y,z)

		let steps= [
				[v(27.93, 0.43, 1), v(-0.41, 1.53, 0.41), v(r * Math.cos(1.25664 * 5), 0,r * Math.sin(1.25664 * 5))]
			,	[v(-3.93, 0.79, 2.4), v(-3.11, 0.86, 3.12), v(r * Math.cos(1.25664 * 2), 4,r * Math.sin(1.25664 * 2))]
			,	[v(1.82, 3.26, 2.47), v(-0.02, 0.86, 0.18), v(r * Math.cos(1.25664 * 3), 4,r * Math.sin(1.25664 * 3))]
			,	[v(4.5855, 1.10, 14.99), v(-3.12, -0.34, -3.13), v(r * Math.cos(1.25664 * 4), 4,r * Math.sin(1.25664 * 4))]
			,	[v(10.38, 8.31, 8.68), v(-0.76, 0.71, 0.59), v(0,0,0)]
			,	[v(9.43, 2.82, -4.88), v(-0.10, 0.16,0.16), v(0,0,0)]
		]
		let current = -1
		function next(){
			current++
			if(current >= steps.length)
				current = 0
			goTo(current)
		}
		function prev(){
			current--
			if(current < 0)
				current = steps.length - 1
			goTo(current)
		}
		function goTo(id){
			let pos = {
				x: steps[id][0].x,
				y: steps[id][0].y,
				z: steps[id][0].z,
			}
			var tween1 = new Tween(global.camera.position)
	        .to(pos, 1500)
	        .easing(Easing.Quadratic.In)
	        .start();

			let rot = {
				x: steps[id][1].x,
				y: steps[id][1].y,
				z: steps[id][1].z,
			}
	        var tween2 = new Tween(global.camera.rotation)
	        .to(rot, 1500)
	        .easing(Easing.Quadratic.In)
	        .start();

			// global.controls.target = steps[id][2]
			// global.controls.update()

			console.log(camera.position);
			console.log(pos, rot);
		}

		document.addEventListener("keydown", function ( event ) {
			if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
				event.preventDefault();
			}
		}, false);
		document.addEventListener("keyup", function ( event ) {
			if ( event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40) ) {
				switch( event.keyCode ) {
					case 33: // pg up
					case 37: // left
					case 38: // up
						prev();
						break;
					case 9:  // tab
					case 32: // space
					case 34: // pg down
					case 39: // right
					case 40: // down
						next();
						break;
				}
				event.preventDefault();
			}
		}, false);
		document.addEventListener("touchstart", function ( event ) {
			if (event.touches.length === 1) {
				var x = event.touches[0].clientX,
					width = window.innerWidth * 0.3,
					result = null;
				if ( x < width ) {
					result = prev();
				} else if ( x > window.innerWidth - width ) {
					result = next();
				}
				if (result) {
					event.preventDefault();
				}
			}
		}, false);


			let r = 20

			var camera, scene,
			bulbLight, bulbMat, ambientLight,
			object, loader, stats;
			var ballMat, cubeMat, floorMat, hemiLight;
			var that = this;

			// ref for lumens: http://www.power-sure.com/lumens.htm
			var bulbLuminousPowers = {
				"110000 lm (1000W)": 110000,
				"3500 lm (300W)": 3500,
				"1700 lm (100W)": 1700,
				"800 lm (60W)": 800,
				"400 lm (40W)": 400,
				"180 lm (25W)": 180,
				"20 lm (4W)": 20,
				"Off": 0
			};

			// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
			var hemiLuminousIrradiances = {
				"0.0001 lx (Moonless Night)": 0.0001,
				"0.002 lx (Night Airglow)": 0.002,
				"0.5 lx (Full Moon)": 0.5,
				"3.4 lx (City Twilight)": 3.4,
				"50 lx (Living Room)": 50,
				"100 lx (Very Overcast)": 100,
				"350 lx (Office Room)": 350,
				"400 lx (Sunrise/Sunset)": 400,
				"1000 lx (Overcast)": 1000,
				"18000 lx (Daylight)": 18000,
				"50000 lx (Direct Sun)": 50000
			};

			var params = {
				shadows: true,
				exposure: 0.68,
				bulbPower: Object.keys( bulbLuminousPowers )[ 4 ],
				hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
			};


			var clock = new THREE.Clock();

			init();

			function init() {
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 200 );
				global.camera = camera
				camera.position.x = -4;
				camera.position.z = 4;
				camera.position.y = 2;

				scene = new THREE.Scene()
				global.scene = scene
				scene.fog = new THREE.FogExp2(0xffffff,0.001)

				// var light = new THREE.AmbientLight( 0xcccccc ); // soft white light
				// scene.add( light );


				// lights

				bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
				bulbLight.power = 50000
				global.bulbLight = bulbLight
				bulbLight.position.set( 0, 50, -50 );
				bulbLight.castShadow = true;
				scene.add( bulbLight );

				bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
				bulbLight.power = 50000
				global.bulbLight = bulbLight
				bulbLight.position.set( 0, 50, 50 );
				bulbLight.castShadow = true;
				scene.add( bulbLight );

				bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
				bulbLight.power = 50000
				global.bulbLight = bulbLight
				bulbLight.position.set( -50, 50, -50 );
				bulbLight.castShadow = true;
				scene.add( bulbLight );

				bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );
				bulbLight.power = 50000
				global.bulbLight = bulbLight
				bulbLight.position.set( -50, 50, 50 );
				bulbLight.castShadow = true;
				scene.add( bulbLight );


				hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
				scene.add( hemiLight );

				floorMat = new THREE.MeshStandardMaterial( {
					roughness: 0.8,
					color: 0xffffff,
					metalness: 0.02,
					bumpScale: 0.0005
				});
				var textureLoader = new THREE.TextureLoader();
				textureLoader.load( "textures/hardwood2_diffuse.jpg", function( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 100, 240 );
					floorMat.map = map;
					floorMat.needsUpdate = true;
				} );
				textureLoader.load( "textures/hardwood2_bump.jpg", function( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 100, 240 );
					floorMat.bumpMap = map;
					floorMat.needsUpdate = true;
				} );
				textureLoader.load( "textures/hardwood2_roughness.jpg", function( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 100, 240 );
					floorMat.roughnessMap = map;
					floorMat.needsUpdate = true;
				} );

				cubeMat = new THREE.MeshStandardMaterial( {
					roughness: 0.7,
					color: 0xffffff,
					bumpScale: 0.002,
					metalness: 0.2
				});
				textureLoader.load( "textures/brick_diffuse.jpg", function( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 1, 1 );
					cubeMat.map = map;
					cubeMat.needsUpdate = true;
				} );
				textureLoader.load( "textures/brick_bump.jpg", function( map ) {
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
					map.anisotropy = 4;
					map.repeat.set( 1, 1 );
					cubeMat.bumpMap = map;
					cubeMat.needsUpdate = true;
				} );

				ballMat = new THREE.MeshStandardMaterial( {
					color: 0xffffff,
					roughness: 0.5,
					metalness: 1.0
				});
				textureLoader.load( "textures/planets/earth_atmos_2048.jpg", function( map ) {
					map.anisotropy = 4;
					ballMat.map = map;
					ballMat.needsUpdate = true;
				} );
				textureLoader.load( "textures/planets/earth_specular_2048.jpg", function( map ) {
					map.anisotropy = 4;
					ballMat.metalnessMap = map;
					ballMat.needsUpdate = true;
				} );

				var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
				var floorMesh = new THREE.Mesh( floorGeometry,new THREE.MeshBasicMaterial( {
					 color: 0x000000,
					 opacity:0.8,
					 transparent: true
				 } ) );
				// var floorMesh = new THREE.Mesh( floorGeometry, floorMat);
				floorMesh.receiveShadow = true;
				floorMesh.rotation.x = -Math.PI / 2.0;
				scene.add( floorMesh );

				var WIDTH = window.innerWidth;
				var HEIGHT = window.innerHeight;
				var groundMirror = new Mirror( 2000, 2000, { clipBias: 0.003, textureWidth: WIDTH, textureHeight: HEIGHT, color: 0x777777 } );
				groundMirror.rotateX( - Math.PI / 2 );
				groundMirror.position.y = -0.01
				scene.add( groundMirror );

				that.renderer = new THREE.WebGLRenderer();
				that.renderer.setClearColor( 0x7ec0ee );
				that.renderer.physicallyCorrectLights = true;
				that.renderer.antialias = true
				that.renderer.gammaInput = true;
				that.renderer.gammaOutput = true;
				that.renderer.shadowMap.enabled = true;
				that.renderer.toneMapping = THREE.ReinhardToneMapping;
				that.renderer.setPixelRatio( window.devicePixelRatio * 2 );
				that.renderer.setSize( window.innerWidth, window.innerHeight );


				var controls = new OrbitControls( camera,that.renderer.domElement );
				controls.target.set( 0, 0, 0 );
				controls.enablePan = false;
				controls.minDistance = 0;
				controls.maxDistance = 5000.0;
				controls.maxPolarAngle = Math.PI * 0.495;
				global.controls = controls
				// controls.target.set( 0, 500, 0 );

				// controls.update();

				window.addEventListener( 'resize', onWindowResize, false );

				//my codes

				// Load Slye logo

				var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
				};

				var onError = function ( xhr ) { };

				THREE.Loader.Handlers.add( /\.dds$/i, new DDSLoader() );

				var objLoader = new OBJLoader();
				// objLoader.setMaterials( materials );
				objLoader.setPath( '3d/' );
				objLoader.load( 'Logo/Slye.obj', function ( object ) {
					global.logo = object

					// y material
					var blackMaterial = new THREE.MeshPhongMaterial({color: 0x191919});
					object.children[0].material = blackMaterial
					object.children[2].material = blackMaterial
					object.children[3].material = blackMaterial
					object.children[4].material = blackMaterial

					object.children[4].position

					object.children[1].material.color.r = 0xfe
					object.children[1].material.color.g = 0xe1
					object.children[1].material.color.b = 0x01

					object.position.y = 0.77;
					object.position.x = 0;

					object.scale.x =
						object.scale.y =
						object.scale.z = 0.2

					scene.add( object );

				}, onProgress, onError );

				// load VR headset
				objLoader.load('vr/V3.obj', function(object){
					// var loader = new THREE.TextureLoader()
					// loader.setPath('3d/vr/textures/')
					//
					// loader.load('base.png', function(map){
					// 	object.children[0].material[0].map = map
					// })
					//
					// loader.load('logo.png', function(map){
					// 	object.children[0].material = new
					// })

					var blackMaterial = new THREE.MeshPhongMaterial({color: 0x191919});
					object.children[0].material = blackMaterial

					global.vr = object
					object.scale.x =
						object.scale.y =
						object.scale.z = 0.2
					object.position.y = 1
					object.position.z = 20
					// controls.target.set(0, 1, 20)
					// controls.update()
					object.rotation.y = Math.PI / 4
					object.material

					object.position.z = r * Math.sin(1.25664 * 1)
					object.position.x = r * Math.cos(1.25664 * 1)
					object.rotation.y = 1.25664 * 1

					scene.add(object)
				}, onProgress, onError)

				// load
				objLoader.load('Monitor.obj', function(object){
					global._monitor = object
					object.scale.x =
					object.scale.y =
					object.scale.z = 0.5

					object.position.y = 0.6
					object.position.z = r * Math.sin(1.25664 * 5)
					object.position.x = r * Math.cos(1.25664 * 5)
					object.rotation.y = 1.25664 * 6

					scene.add(object)
				})

				// load powerpoint logo
				let pw_geometry = new THREE.PlaneGeometry(11.0/5, 10.8/5)
				let pw_material = new THREE.MeshBasicMaterial({
					transparent: true,
					// opacity: 0.8,
					// alphaTest: 0.5,
					depthWrite: false,
					color: 0xcb4a32,
					side: THREE.DoubleSide,
					map: THREE.ImageUtils.loadTexture( 'images/powerpoint.png' )
				})
				let pw_mesh = new THREE.Mesh(pw_geometry, pw_material)
				pw_mesh.position.y = 4
				pw_mesh.position.x = 15
				pw_mesh.position.z = 10
				global.pw_mesh = pw_mesh

				pw_mesh.position.z = r * Math.sin(1.25664 * 2)
				pw_mesh.position.x = r * Math.cos(1.25664 * 2)
				pw_mesh.rotation.y = 1.25664 * 2


				scene.add(pw_mesh)


				let pr_geometry = new THREE.PlaneGeometry(98.6/10, 36.0/10)
				let pr_material = new THREE.MeshBasicMaterial({
					transparent: true,
					// opacity: 0.7,
					color: 0x0081ff,
					side: THREE.DoubleSide,
					// alphaTest: 0.5,
					depthWrite: false,
					map: THREE.ImageUtils.loadTexture( 'images/prezi.png' )
				})
				let pr_mesh = new THREE.Mesh(pr_geometry, pr_material)
				pr_mesh.position.y = 5
				pr_mesh.position.x = -15
				pr_mesh.position.z = 10
				global.pr_mesh = pr_mesh


				pr_mesh.position.z = r * Math.sin(1.25664 * 3)
				pr_mesh.position.x = r * Math.cos(1.25664 * 3)
				pr_mesh.rotation.y = 1.25664 * 3 + Math.PI

				scene.add(pr_mesh)

				// Type texts

				let fontLoader = new THREE.FontLoader()
				fontLoader.load('fonts/a.json', function(font){
					var blackMaterial = new THREE.MeshPhongMaterial({
						color: 0x191919,
						emissive: 0x072534,
						side: THREE.DoubleSide,
						shading: THREE.FlatShading
					});
					var goldenMaterial = new THREE.MeshPhongMaterial({
						emissive: 0x072534,
						side: THREE.DoubleSide,
						shading: THREE.FlatShading
					})
					goldenMaterial.color.r = 0xfe
					goldenMaterial.color.g = 0xe1
					goldenMaterial.color.b = 0x01
					let geometry, mesh
					geometry = new THREE.TextGeometry('Modern', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 6
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)


					geometry = new THREE.TextGeometry('Attractive', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 5
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)


					geometry = new THREE.TextGeometry('3D', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 4
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)

					geometry = new THREE.TextGeometry('Impressive', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 3
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)


					geometry = new THREE.TextGeometry('Easy to use!', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 2
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)

					geometry = new THREE.TextGeometry('Different', {
						font: font,
						size: 0.5,
						height: 0.025
					})
					mesh = new THREE.Mesh(geometry, blackMaterial)
					mesh.position.y = 1
					mesh.position.z = r * Math.sin(1.25664 * 4)
					mesh.position.x = r * Math.cos(1.25664 * 4)
					mesh.rotation.y = 1.25664 * 5
					scene.add(mesh)
				})
				//glyphs
				fontLoader.load('fonts/x.json', function(font){
					fontLoader.load('fonts/font.typeface.json', function(font0){
						for(let key in font0.data.glyphs){
							font.data.glyphs[key] = font0.data.glyphs[key]
						}
						console.log(font.data);
						var blackMaterial = new THREE.MeshPhongMaterial({
							color: 0x191919,
							emissive: 0x072534,
							side: THREE.DoubleSide,
							shading: THREE.FlatShading
						});
						var goldenMaterial = new THREE.MeshPhongMaterial({
							emissive: 0x072534,
							side: THREE.DoubleSide,
							shading: THREE.FlatShading
						})
						goldenMaterial.color.r = 0xfe
						goldenMaterial.color.g = 0xe1
						goldenMaterial.color.b = 0x01

						var geometry, mesh

						// Slye text
						geometry = new THREE.TextGeometry(
							Typer(
								'”اسلای“',
								'rtl'
							)
							, {
							font: font,
							size: 2,
							height: 0.1,
							//curveSegments: 12,
							// bevelEnabled: true,
							// bevelThickness: 10,
							// bevelSize: 8,
							// bevelSegments: 5
						} );
						global.text = geometry
						mesh = new THREE.Mesh(geometry, goldenMaterial)
						mesh.position.y = 1
						mesh.position.x = 1.2
						mesh.rotation.y = Math.PI / 4
						scene.add(mesh)
					})
				})
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			that.renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate(time) {
				requestAnimationFrame( animate );
				if(global.vr)
					global.vr.rotation.y += 0.01

				camera.updateProjectionMatrix();
				that.renderer.render(scene, camera);

				TweenUpdate(time);
			}

			requestAnimationFrame(animate);
	}


	render(){
		let Canvas = this.renderer.domElement
		return (
			<div
				id='preview'
				ref={(el) => {el && !el.childElementCount && el.appendChild(Canvas)}}
			/>
		)
	}
}

export default Presentation
