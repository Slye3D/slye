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

import {Vector3, Euler} from 'three'
import Template from '../Template'
import Events from '../Events'

function fromJSON(data){
	global.__presentation__.meta	= data.meta
	global.__presentation__.path	= data.path
	global.__presentation__.configs	= data.configs
	global.__presentation__.properties	= data.properties

	for(let key in data.steps){
		data.steps[key].position	= new Vector3(...data.steps[key].position)
		data.steps[key].rotation	= new Euler(...data.steps[key].rotation, 'XYZ')
	}
	global.__presentation__.steps = data.steps

	for(let key in data.components){
		data.components[key].position	= new Vector3(...data.components[key])
		data.components[key].rotation	= new Euler(...data.components[key], 'XYZ')
		let Com							= getHandler(data.components[key].handler)
		global.__presentation__.__cache__.c2o[key] = new Com(data.components[key].props, key)
	}
	global.__presentation__.components	= data.components

	Template.load(data.template.name, data.template.props)

	Events.emit('pathChanged')
}

function toJSON(){
	let data = {
			meta		: global.__presentation__.meta
		,	steps		: {}
		,	components	: {}
		,	path		: global.__presentation__.path
		,	configs		: global.__presentation__.configs
		,	properties	: global.__presentation__.properties
		,	template	: {
			name	: global.__presentation__.template.name
		,	props	: global.__presentation__.template.props
		}
	}
	for(let key in global.__presentation__.steps){
		data.steps[key] = {
			components	: global.__presentation__.steps[key].components
		,	position	: [
			global.__presentation__.steps[key].position.x
		,	global.__presentation__.steps[key].position.y
		,	global.__presentation__.steps[key].position.z
			]
		,	rotation	: [
			global.__presentation__.steps[key].rotation.x
		,	global.__presentation__.steps[key].rotation.y
		,	global.__presentation__.steps[key].rotation.z
			]
		}
	}
	for(let key in global.__presentation__.components){
		data.components[key]	= {
			handler	: global.__presentation__.components[key].handler
		,	props	: global.__presentation__.__cache__.c2o[key].props
		,	position	: [
			global.__presentation__.components[key].position.x
		,	global.__presentation__.components[key].position.y
		,	global.__presentation__.components[key].position.z
			]
		,	rotation	: [
			global.__presentation__.components[key].rotation.x
		,	global.__presentation__.components[key].rotation.y
		,	global.__presentation__.components[key].rotation.z
			]
		}
	}

	return JSON.stringify(data)
}

export default {
	toJSON
,	fromJSON
}

export {
	toJSON
,	fromJSON
}
