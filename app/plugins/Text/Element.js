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

import React from 'react'
import {SlyeComponent} from 'SDK'
import {Card} from 'SDK/API/Story/UI'
import * as THREE from 'three'
import {TextField} from 'material-ui'
import Typer from 'src/SDK/Typer'

class TextElement extends SlyeComponent{
	goldenMaterial = new THREE.MeshPhongMaterial({
		emissive: 0xe51041,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading
	})

	constructor(){
		super()
		let fontLoader = new THREE.FontLoader()

		fontLoader.load(__dirname + '/fonts/x.json', (font) => {
			fontLoader.load(__dirname + '/fonts/font.typeface.json', (font0) => {
				for(let key in font0.data.glyphs){
					font.data.glyphs[key] = font0.data.glyphs[key]
				}
				this.font = font
				this.forceRerender()
			})
		})
	}

	render(){
		if(!this.font)
			return
		let geometry = new THREE.TextGeometry(
			Typer(
				this.props.text,
				'rtl'
			)
			, {
			font: this.font,
			size: 2,
			height: 0.1,
			//curveSegments: 12,
			// bevelEnabled: true,
			// bevelThickness: 10,
			// bevelSize: 8,
			// bevelSegments: 5
		} );
		let mesh = new THREE.Mesh(geometry, this.goldenMaterial)
		return mesh
	}

	change = (e) => {
		this.setProps({
			text: e.target.value
		})
	}

	preview(){
		return (
			<Card>
				<TextField
					id={this.uuid}
					name={this.uuid}
					value={this.props.text}
					onChange={this.change}
					fullWidth={true}
				/>
			</Card>
		)
	}
}

export default TextElement
