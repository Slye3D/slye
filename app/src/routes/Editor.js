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
import {Route, Link} from 'react-router-dom'
import {
		Paper
	,	BottomNavigation
	,	BottomNavigationItem
	,	FontIcon
} from 'material-ui'

import 'src/css/Editor.css'
import Story from './Story'
import Preview from './Preview'
import ProfileAvatar from 'src/components/ProfileAvatar'
import Thumbnails from 'src/components/Thumbnails'
import Presentation from './Presentation'
import Controls from './Controls'

import {Fileformat, Renderer} from 'SDK/API'

const	previewIcon	= <FontIcon className="material-icons">3d_rotation</FontIcon>
	,	storyIcon	= <FontIcon className="material-icons">format_list_numbered</FontIcon>
	,	designIcon	= <FontIcon className="material-icons">palette</FontIcon>
	,	playIcon	= <FontIcon className="material-icons">play_arrow</FontIcon>

// initialize first step
let stepUUID = Fileformat.Steps.createStep()
Fileformat.Path.add2Path(stepUUID)

class Editor extends Component{
	state = {
	    selectedIndex: 0,
	}

	select = (index) => this.setState({selectedIndex: index})

	constructor(){
		super(...arguments)

		let selectedIndex = 0
		if(window.location.pathname.startsWith(this.props.match.url + '/story'))
			selectedIndex = 1
		if(window.location.pathname.startsWith(this.props.match.url + '/design'))
			selectedIndex = 2
		if(window.location.pathname.startsWith(this.props.match.url + '/play'))
			selectedIndex = 3

		this.state = {
			selectedIndex
		}

		let render = () => {
			requestAnimationFrame(render)
			Renderer.requestAnimationFrame()
		}
		render()
	}

	render(){
		return (
			<div className={['full-height', 'page-' + ([
					'preview'
				,	'story'
				,	'design'
				,	'play'
			])[this.state.selectedIndex]
		].join(' ')}>
				<Preview />

				<Route path={`${this.props.match.url}/3d`} component={Controls} />
				<Route path={`${this.props.match.url}/story`} component={Story} />

				<Thumbnails />

				<Paper zDepth={2} id='navbar' className={this.state.selectedIndex == 0 ? 'x' : 'selected'}>
					<BottomNavigation selectedIndex={this.state.selectedIndex}>
					  <Link to='3d' onClick={() => this.select(0)}>
					  <BottomNavigationItem
						icon={previewIcon}
						selected={this.state.selectedIndex == 0}
					  />
					  </Link>

					  <Link to='story' onClick={() => this.select(1)}>
					  <BottomNavigationItem
						icon={storyIcon}
						selected={this.state.selectedIndex == 1}
					  />
					  </Link>

					  <Link to='design' onClick={() => this.select(2)}>
					  <BottomNavigationItem
						icon={designIcon}
						selected={this.state.selectedIndex == 2}
					  />
					  </Link>

					  <Link to='play' onClick={() => this.select(3)}>
					  <BottomNavigationItem
						icon={playIcon}
						selected={this.state.selectedIndex == 3}
					  />
					  </Link>
					</BottomNavigation>
				</Paper>

				<Paper className="story-toolbox story-right" zDepth={3} style={{
					boxShadow: 'rgba(0, 0, 0, 0.19) -10px 0 30px, rgba(0, 0, 0, 0.23) -6px 0 10px'
				}}>
					<ProfileAvatar />
				</Paper>
			</div>
		)
	}
}

export default Editor
