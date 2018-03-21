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

import SlyeTemplate from '../../classes/SlyeTemplate';

global.__presentation__.template		= new SlyeTemplate();
global.__presentation__.template.name	= null;
global.__templates__	= {};

function load(name, props) {
	// TODO: remove 3D elements of previous template form scene
  const templateClass	= global.__templates__[name].obj;
  global.__presentation__.template = new templateClass(props);
  global.__presentation__.template.name	= name;
  global.__presentation__.template.init();
}

function getStepPosition(i) {
  return global.__presentation__.template.getStepPosition(i);
}

function getStepRotation(i) {
  return global.__presentation__.template.getStepRotation(i);
}

function getTemplate() {
  return global.__presentation__.template;
}

function registerTemplate(id, name, templateClass) {
  global.__templates__[id] = {
    name,
    obj: templateClass
  };
}

export default {
  load,
  getStepPosition,
  getStepRotation,
  getTemplate,
  registerTemplate
};

export {
		load
	,	getStepPosition
	,	getStepRotation
	,	getTemplate
	,	registerTemplate
};
