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

import './_Init'
import Thumbnails from './_Thumbnails'
import Viewport from './_Viewport'
import {getTemplate} from '../Template'
import {Steps, Components} from '../Fileformat'
import Navigation from '../Navigation'
import * as THREE from 'three'
import Events from '../Events'

const Scene = global.__scene__

global.__renderCallNum__	= 0
global.__isInPlayMode__		= false

function stepRequestAnimationFrame(stepUUID){
	// Call requestAnimationFrame of all components in the step
	Steps.getStep(stepUUID).components.map(uuid => {
		Components.getComponentObject(uuid).requestAnimationFrame()
	})
}

function requestAnimationFrame(){
	global.__renderCallNum__++
	global.__renderCallNum__ %= 60

	// Render thumbnails (60 / 2 = 30 FPS)
	// if(global.__renderCallNum__ % 2 == 0){
		Thumbnails.requestAnimationFrame()
	// }

	if(global.__isInPlayMode__){
		getTemplate().requestAnimationFrame()
		let stepUUIDs	= Steps.getSteps()
		let a 			= global.__renderCallNum__ % 4
		let current		= stepUUIDs.indexOf(Navigation.currentUUID)
		for(let i = a;i < stepUUIDs.length;i += 4){
			stepRequestAnimationFrame(stepUUIDs[i])
		}
		// Render current step at 60 FPS
		if(((current - a) % 4) > 0){
			stepRequestAnimationFrame(stepUUIDs[current])
		}
	}

	Viewport.requestAnimationFrame()
}

function hardRender(stepUUID){
	let group = new THREE.Group()
	group.uuid	= stepUUID
	let tmp
	let components = Steps.getStep(stepUUID).components
	for(let uuid of components){
		let obj = Components.getComponentObject(uuid).__three__
		if(!obj)
			return
		tmp = Components.getComponent(uuid).position
		obj.position.set(tmp.x, tmp.y, tmp.z)
		tmp = Components.getComponent(uuid).rotation
		obj.rotation.set(tmp.x, tmp.y, tmp.z)
		group.add(obj)
	}
	// todo add a flag to empty components
	tmp = Steps.getStep(stepUUID).position
	group.position.set(tmp.x, tmp.y, tmp.z)
	tmp = Steps.getStep(stepUUID).rotation
	group.rotation.set(tmp.x, tmp.y, tmp.z)

	// replace new group with old one
	let oldGroup = global.__presentation__.__cache__.steps[stepUUID]
	if(oldGroup){
		global.__scene__.remove(oldGroup)
		delete global.__presentation__.__cache__.steps[stepUUID]
	}
	global.__presentation__.__cache__.steps[stepUUID]	= group
	global.__scene__.add(group)
}

Events.on('stepsComponentsChanged', hardRender)

export default {
		Scene
	,	Thumbnails
	,	Viewport
	,	requestAnimationFrame
	,	hardRender
}

export {
		Scene
	,	Thumbnails
	,	Viewport
	,	requestAnimationFrame
	,	hardRender
}
