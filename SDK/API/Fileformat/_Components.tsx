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

import { getHandler } from '../Component';
import { generateUUID } from '../../Math';
import { Vector3, Euler } from 'three';
import { removeComponentFromStep } from './_Steps';
import { emit } from '../Events';

const presentation = global.__presentation__;

function removeComponent(componentUUID) {
  if (!presentation.components[componentUUID]) { return false; }
	// Remove component from owner step
  const stepUUID = presentation.__cache__.c2s[componentUUID];
  if (stepUUID) { removeComponentFromStep(stepUUID, componentUUID); }

	// Send kill signal to component
  presentation.__cache__.c2o[componentUUID].emit('dispatch');

	// Hard-delete everything related to the component after 750ms
  setTimeout(() => {
    delete presentation.__cache__.c2o[componentUUID];
    delete presentation.__cache__.c2s[componentUUID];
    delete presentation.components[componentUUID];
  }, 750);
  emit('componentRemoved', componentUUID);
  return true;
}

function createComponent(handler, props) {
  const Com		= getHandler(handler);
  if (!Com) { return; }
  const uuid	= generateUUID();
  presentation.components[uuid]	= {
    handler,
    props,
    position: new Vector3(0, 0, 0),
    rotation: new Euler(0, 0, 0, 'XYZ')
  };
  presentation.__cache__.c2o[uuid] = new Com(props, uuid);
  emit('componentCreated', uuid);
  return uuid;
}

function setComponentProps(uuid, props) {
  if (!presentation.components[uuid]) { return; }
  for (const key in props) { presentation.components[uuid][key] = props[key]; }
  return true;
}

function getComponentObject(uuid) {
  return presentation.__cache__.c2o[uuid];
}

function getComponent(uuid) {
  return presentation.components[uuid];
}

export default {
  removeComponent,
  createComponent,
  setComponentProps,
  getComponentObject,
  getComponent
};

export {
		removeComponent
	,	createComponent
	,	setComponentProps
	,	getComponentObject
	,	getComponent
};
