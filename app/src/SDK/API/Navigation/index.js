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

import { Path } from '../Fileformat';
import { emit } from '../Events';

global.__current__	= 0;

function goTo(stepUUID) {
	// TODO:10 finish after rendering loop
}

function goToPathId(pathId) {
  if (pathId >= Path.len()) { return; }
  const stepUUID		= Path.getPoint(pathId);
  global.__current__	= pathId;
  goTo(stepUUID);
  emit('currentStepChanged');
}

function next() {
  if (Path.len() == 0) { return; }
  global.__current__++;
  global.__current__ %= Path.len();
  goToPathId(global.__current__);
}

function prev() {
  if (Path.len() == 0) { return; }
  global.__current__--;
  if (global.__current__ < 0) { global.__current__ = Path.len() - 1; }
  goToPathId(global.__current__);
}

export default {
  goTo,
  goToPathId,
  next,
  prev,
  set current(pathId) {
    global.__current__	= pathId;
    goToPathId(pathId);
  },
  get current() {
    return global.__current__;
  },
  get currentUUID() {
    return Path.getPoint(global.__current__);
  }
};


export {
		goTo
	,	goToPathId
	,	next
	,	prev
};
