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

// this file is a standard format for a Slye presentation
function init() {
  if (global.__presentation__) { return; }
  global.__presentation__	= {
		// somewhere to save presentation meta-data like author, title, ...
    meta: {},

		 steps: {
			// uuid -> {
			// 			position	: Vector3
			// 		,	rotation	: Euler
			// 		,	components	: [component (with uuid | order don't matter)]
			// }
 },
		 components: {
			// uuid	-> {
			// 		handler	: SlyeComponent name
			// 	,	position: Vector3
			// 	,	rotation: Euler
			// 	,	props	: Object
			// }
 },
		 path: [
			// array of steps (with uuid | order matters)
 ],
		 configs: {
			// property -> value
 },
		 properties: {
			// Three.js object uuid -> Object of changed properties
 },
		// template object
		 template: null,


		// this values won't save in filesystem and they are just for run-time-cahce
		 __cache__: {
				// component to step
   c2s: {},
				// component to SlyeComponent object
			 	c2o: {},
				// Steps Group (Object3D)
   steps: {},
				// Step uuid -> [Camera, Renderer]
   thumbnails: {}
 }
  };
}

init();

export default init;

export {
	init
};
