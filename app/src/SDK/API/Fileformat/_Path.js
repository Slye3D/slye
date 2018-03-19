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

import {emit} from '../Events'
const presentation	= global.__presentation__

function add2Path(stepUUID, index){
	// FIXME: rewrite this using a better algorithm
	let len	= presentation.path.length
	index	= index == undefined ? len : index
	index	= Math.max(0, index)
	if(len == 0 || index >= len){
		presentation.path.push(stepUUID)
		emit('pathChanged')
		return presentation.path
	}
	let tmp = []
	for(let i = 0;i < len;i++){
		if(i == index)
			tmp.push(stepUUID)
		tmp.push(presentation.path[i])
	}
	if(global.__current__ > index)
		global.__current__++
	presentation.path = tmp
	emit('pathChanged')
	return presentation.path
}

function removePathPoint(i){
	presentation.path	= presentation.slice(0, i - 1).concat(
		presentation.slice(i + 1)
	)
	if(!arguments[1])
		emit('pathChanged')
	return presentation.path
}

function removeStepFromPath(stepUUID){
	let x
	while((x = presentation.path.indexOf(stepUUID)) > -1){
		removePathPoint(x, true)
	}
	emit('pathChanged')
	return presentation.path
}

function getPath(){
	return presentation.path
}

function getPoint(i){
	return presentation.path[i]
}

function len(){
	return presentation.path.length
}

export default {
		add2Path
	,	getPath
	,	getPoint
	,	len
	,	removePathPoint
	,	removeStepFromPath
}

export {
		add2Path
	,	getPath
	,	getPoint
	,	len
	,	removePathPoint
	,	removeStepFromPath
}
