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

import {Viewport} from 'SDK/API/Renderer'

class Preview extends Component{
	constructor(){
		super()

		let resizeHandler = () => {
			Viewport.resizeRenderer(window.innerWidth, window.innerHeight)
		}
		window.addEventListener('resize', resizeHandler, false)
		resizeHandler()
	}


	render(){
		let Canvas = Viewport.getDom()
		return (
			<div
				id='preview'
				ref={(el) => {el && !el.childElementCount && el.appendChild(Canvas)}}
			/>
		)
	}
}

export default Preview
