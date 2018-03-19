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

import {WebGLRenderer, PerspectiveCamera} from 'three'

global.__renderer__	= new WebGLRenderer()
global.__camera__	= new PerspectiveCamera(75, 1, 0.1, 1000)

function resizeRenderer(width, height){
	global.__renderer__.setSize(width, height)
	global.__camera__.aspect	= width / height
	global.__camera__.updateProjectionMatrix()
}

function requestAnimationFrame(){
	global.__renderer__.render(global.__scene__, global.__camera__)
}

function getDom(){
	return global.__renderer__.domElement
}

function setPlaymode(isEnable){
	global.__isInPlayMode__	= isEnable
}

/**
 * Set active controls of object
 * @param {String} control
 * One of:
 * 	1. translate
 * 	2. rotate
 * 	3. scale
 * 	4. move
 * 	5. orbit
 */
function setControl(control){

}

let renderer = global.__renderer__

export default {
		resizeRenderer
	,	requestAnimationFrame
	,	getDom
	,	setPlaymode
	,	renderer
}

export {
		resizeRenderer
	,	requestAnimationFrame
	,	getDom
	,	setPlaymode
	,	renderer
}
