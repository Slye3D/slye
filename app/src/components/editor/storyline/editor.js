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
import DragSortableList from 'react-drag-sortable'
import API from 'SDK'
import {on} from 'SDK/API/Events'
import {Navigation, Fileformat} from 'SDK/API'

class Editor extends Component{
	constructor(){
		super()
		let text = new (API.Component.getHandler('text'))()
		this.state = {
			elements: [
				text.preview
			]
		}

		// we should rerender when current step changes
		// & we should rerender when current step changes
		//
		// BUG: Error when user opens Editor section and close it and then open it again
		// Warning: forceUpdate(...): Can only update a mounted or mounting component.
		// This usually means you called forceUpdate() on an unmounted component.
		// This is a no-op. Please check the code for the Editor component.
		on(['currentStepChanged', 'stepsComponentsChanged'], () => {
			if(this._ismounted)
				this.forceUpdate()
		})
	}

	componentDidMount() {
	  this._ismounted = true;
	}

	componentWillUnmount() {
	   this._ismounted = false;
	}

	dispatch(){
		console.log('x');
	}

	onSort(list){
		Fileformat.Steps.setStepProps(Navigation.currentUUID, {
			components: list.map(x => x.content.key)
		})
	}

	render(){
		let currentStep = Navigation.currentUUID
		let x = Fileformat.Steps.getStep(currentStep)
		let coms = x.components.map(uuid => {
			let 	C = Fileformat.Components.getComponentObject(uuid)
				,	X = C.reactComponent
			return {content: <X key={uuid} />}
		})
		return (
			<div>
				<DragSortableList items={coms} moveTransitionDuration={0.3} onSort={this.onSort} type="vertical"/>
			</div>
		)
	}
}

export default Editor
