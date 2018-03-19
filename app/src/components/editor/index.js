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
import {
		Paper
	,	BottomNavigation
	,	BottomNavigationItem
	,	FontIcon
} from 'material-ui'

// import styles
import 'src/css/Editor.css'
// import pages
import Story from './storyline'
import Design from './design'
import Viewport from './viewport'
import Controls from './controls'
// import components for this page
import Thumbnails from './thumbnails'
// import SDK
import {Fileformat, Renderer, Template, Events} from 'SDK/API'
import Axios from 'SDK/Axios'
// import keyboard events
import Keys from './keys'

// generate icons
// FIXME: rewrite this using svg-icons
const	previewIcon	= <FontIcon className="material-icons">3d_rotation</FontIcon>
	,	storyIcon	= <FontIcon className="material-icons">format_list_numbered</FontIcon>
	,	designIcon	= <FontIcon className="material-icons">palette</FontIcon>
	,	playIcon	= <FontIcon className="material-icons">play_arrow</FontIcon>

class Editor extends Component{
	constructor(props){
		super()
		// initialize first step
		let stepUUID = Fileformat.Steps.createStep()
		Fileformat.Path.add2Path(stepUUID)

		Keys(props.match.params.id)
		
		Axios.get('/fs/' + props.match.params.id + '/slye.json').then(d => {
			Fileformat.fromJSON(d.data)
			for(let uuid in d.data.steps){
				Renderer.hardRender(uuid)
			}
		})

		this.pages	= {
				story	: <Story />
			,	design	: <Design />
			,	preview : <Controls />
		}
		this.viewport	= <Viewport />
		this.thumbnails	= <Thumbnails />
		this.state		= {
			page: 'preview'
		}
		document.onwebkitfullscreenchange = () => {
			Events.emit('fullscreenStateChanged', document.webkitIsFullScreen)
			if(!document.webkitIsFullScreen && this.state.page == 'play'){
				setTimeout(() => this.select('preview'), 250)
			}
			let c = document.body.className.split(' ').filter(x => x !== 'full-screen')
			console.log(c);
			if(document.webkitIsFullScreen)
				c.push('full-screen')
			document.body.className = c.join(' ')
		}
	}

	select = (page) => {
		if(page == 'play'){
			Events.emit('fullscreenStateChanged', true)
			document.getElementById('preview').children[0].webkitRequestFullscreen()
		}
		this.setState({
			page: page
		})
	}

	render(){
		let page = this.pages[this.state.page] || null
		return (
			<div className={['full-height', 'page-' + this.state.page].join(' ')}>
				{this.viewport}
				{page}
				{this.state.page == 'play' ? null : this.thumbnails}

				<Paper zDepth={2} id='navbar'>
					<BottomNavigation selectedIndex={this.state.selectedIndex}>
					  <BottomNavigationItem
						icon={previewIcon}
						selected={this.state.page == 'preview'}
						onClick={() => this.select('preview')}
					  />

					  <BottomNavigationItem
						icon={storyIcon}
						selected={this.state.page == 'story'}
						onClick={() => this.select('story')}
					  />

					  <BottomNavigationItem
						icon={designIcon}
						selected={this.state.page == 'design'}
						onClick={() => this.select('design')}
					  />

					  <BottomNavigationItem
						icon={playIcon}
						selected={this.state.page == 'play'}
						onClick={() => this.select('play')}
					  />
					</BottomNavigation>
				</Paper>

				<Paper className="story-toolbox story-right" zDepth={3} style={{
					boxShadow: 'rgba(0, 0, 0, 0.19) -10px 0 30px, rgba(0, 0, 0, 0.23) -6px 0 10px'
				}}>

				</Paper>
			</div>
		)
	}
}

export default Editor
