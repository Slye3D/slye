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
import Avatar from 'material-ui/Avatar'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

class ProfileAvatar extends Component{
	constructor(){
		super()	
		this.state = {
			open: false
		}
	}
	
	handleTap = (event) => {
		event.preventDefault()
		
		this.setState({
			open	: true,
			anchorEl: event.currentTarget
		})
	}
	
	handleRequestClose = () => {
		this.setState({
			open	: false
		})
	}
	
	render(){
		return (
			<div>
				<Avatar
					onClick={this.handleTap}
					size={50}
					className="clickable"
				>A</Avatar>
				<Popover
					open={this.state.open}
					anchorEl={this.state.anchorEl}
					anchorOrigin={{"horizontal":"left","vertical":"center"}}
					targetOrigin={{"horizontal":"right","vertical":"top"}}
					onRequestClose={this.handleRequestClose}
				>
					<Menu>
						<MenuItem primaryText="Test" />
					</Menu>
				</Popover>
			</div>
		)
	}
}

export default ProfileAvatar