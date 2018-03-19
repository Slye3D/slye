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
import {calculateDistance, findCameraPosition} from '../../Math'
import {getStep} from '../Fileformat/_Steps'
import {Path} from '../Fileformat'

global.__thumbnailsRenderer__ 	= new WebGLRenderer({ alpha: true })
global.__renderThumbnails__		= false
let thumbnails	= global.__presentation__.__cache__.thumbnails
let scene 		= global.__scene__
let distance

function updateCamera(stepUUID){
	let step		= getStep(stepUUID)
	if(!step)
		return thumbnails[step]	= null
	let pos			= findCameraPosition(step.position, step.rotation, distance)
	thumbnails[stepUUID][0].rotation.copy(step.rotation)
	thumbnails[stepUUID][0].position.copy(pos)
}

function init(stepUUID){
	if(thumbnails[stepUUID])
		return
	let camera		= new PerspectiveCamera(75, global.__tW__/global.__tH__, 0.1, 250)
	thumbnails[stepUUID] = [camera, null]
	updateCamera(stepUUID)

	// TODO: Effect events like onStepRemoved and etc...
}

function enableRenderer(){
	global.__renderThumbnails__	= true
}

function disableRenderer(){
	global.__renderThumbnails__	= false
}

function setDom(stepUUID, el){
	thumbnails[stepUUID][1] = el
}

function getThumbnailCanvas(){
	return global.__thumbnailsRenderer__.domElement
}

function setThumbnailsSize(width, height, margin){
	global.__tW__	= width
	global.__tH__	= height
	global.__tM__	= margin
	distance	= calculateDistance(
	   		global.__tW__
	   ,	global.__tH__
	   ,	900
	   ,	700
   )
   let n = Object.keys(thumbnails).length
   for(let key in thumbnails){
	   if(thumbnails[key])
	   	updateCamera(key)
   }
}

function setWrapperSize(width, height){
	global.__thumbnailsRenderer__.setSize(width, height)
}

function setWrapperDom(domElement){
	global.__thumbnailsWrapper__ = domElement
}

function requestAnimationFrame(){
	if(!global.__renderThumbnails__)
		return
	let path 	= Path.getPath()
	let w 		= global.__thumbnailsWrapper__
	let width	= global.__tM__ + global.__tW__
	let start	= Math.max(0, Math.floor(w.scrollLeft / width) - 1)
	let length	= Math.ceil(w.offsetWidth / width)
	let end		= Math.min(path.length, start + length + 1)

	let renderer= global.__thumbnailsRenderer__
	renderer.setClearColor(0xffffff)
	renderer.setScissorTest(false)
	renderer.clear()

	renderer.setClearColor(0xe0e0e0)
	renderer.setScissorTest(true)

	for(let i = start;i < end;i++){
		let left = width * i - w.scrollLeft
		renderer.setViewport(left + global.__tM__, 19.25, global.__tW__, global.__tH__)
		renderer.setScissor(left + global.__tM__, 19.25, global.__tW__, global.__tH__)

		renderer.render(scene, thumbnails[path[i]][0])
	}
}



export default {
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
}
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
}
