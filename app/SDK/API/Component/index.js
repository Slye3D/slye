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

global.__ComponentHandlers__	= global.__ComponentHandlers__ || {
	// name -> SlyeComponent
};

function registerHandler(name, SlyeComponent) {
  global.__ComponentHandlers__[name] = SlyeComponent;
}

function getHandler(name) {
  return global.__ComponentHandlers__[name];
}

export default {
  registerHandler,
  getHandler
};

export {
		registerHandler
	,	getHandler
};
