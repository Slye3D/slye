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

import SlyeBase from './SlyeBase'

class SlyeTemplate extends SlyeBase{
	init(){}

	getStepPosition(i){
		return [100 * i, 0, 0]
	}

	getStepRotation(i){
		return [0, 0, 0]
	}
}

export default SlyeTemplate
