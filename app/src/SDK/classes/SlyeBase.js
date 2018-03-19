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

import EventEmitter from './EE'
import * as THREE from 'three'
import {generateUUID} from '../Math'

class SlyeBase extends EventEmitter{
	constructor(props, uuid){
		super()
		this.props	= props || {}
		this.uuid	= uuid
		if(!this.props._randoms_)
			this.props._randoms_= {}
		if(!this.props._uuids_)
			this.props._uuids_	= {}
		this._randomOffset_	= {}
		this._uuidOffset_	= {}
		this.__scopeName__	= 'default'
	}

	requestAnimationFrame(){}

	random(scope){
		scope = scope || this.__scopeName__
		if(!this.props._randoms_[scope]){
			this.props._randoms_[scope]	= []
			this._randomOffset_[scope]	= -1
		}
		this._randomOffset_[scope]++
		if(this.props._randoms_[scope].length > this._randomOffset_[scope])
			return this.props._randoms_[scope][this._randomOffset_[scope]]
		let rand = Math.random()
		this.props._randoms_[scope].push(rand)
		return rand
	}

	generateUUID(scope){
		scope = scope || this.__scopeName__
		if(!this.props._uuids_[scope]){
			this.props._uuids_[scope]	= []
			this._uuidOffset_[scope]	= -1
		}
		this._uuidOffset_[scope]++
		if(this.props._uuids_[scope].length > this._uuidOffset_[scope])
			return this.props._uuids_[scope][this._uuidOffset_[scope]]
		let uuid = generateUUID()
		this.props._uuids_.push(uuid)
		return uuid
	}

	codeScope(name, func){
		let prev = this.__scopeName__
		this.__scopeName__	= name
		const random	= () => {
			return this.random(name)
		}
		const generateUUID	= () => {
			return this.generateUUID(name)
		}
		func(random, generateUUID)
		this.__scopeName__	= prev
	}

	_return_(r){
		if(r.uuid)
			r.uuid	= this.generateUUID()
		return r
	}

	// Audio
	AudioListener(){
		return this._return_(new THREE.AudioListener(...arguments))
	}

	Audio(listener){
		return this._return_(new THREE.Audio(...arguments))
	}

	AudioLoader(context, manager){
		return this._return_(new THREE.AudioLoader(...arguments))
	}

	AudioAnalyser(audio, fftSize){
		return this._return_(new THREE.AudioAnalyser(...arguments))
	}

	PositionalAudio(listener){
		return this._return_(new THREE.PositionalAudio(...arguments))
	}

	// Camera
	PerspectiveCamera(fov, aspect, near, far){
		return this._return_(new THREE.PerspectiveCamera(...arguments))
	}

	OrthographicCamera(left, right, top, bottom, near, far){
		return this._return_(new THREE.OrthographicCamera(...arguments))
	}


}

export default SlyeBase
