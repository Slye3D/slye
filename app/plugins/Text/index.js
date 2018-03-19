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
import FontIcon from 'material-ui/FontIcon'
import API, {SlyeNavIcon} from 'src/SDK'
import {Component, Story, Fileformat, Navigation} from 'src/SDK/API'
import TextElement from './Element'

Component.registerHandler('text', TextElement)

let btn = new SlyeNavIcon(<FontIcon className="material-icons">text_fields</FontIcon>, 'Header')
btn.on('click', () => {
	let componentUUID = Fileformat.Components.createComponent('text', {
			text: 'Sample text...'
		,	type: 'head'
	})
	Fileformat.Steps.addComponentToStep(Navigation.currentUUID, componentUUID)
})
Story.registerIcon(btn)
