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

import EventEmitter from 'eventemitter3';

global.__EM__ = global.__EM__ || new EventEmitter();

function x(name) {
  return function (...args) {
    return global.__EM__[name](...args);
  };
}

const emit	= x('emit'),
	 on 	= function (event, cb) {
   if (typeof event === 'string') { return global.__EM__.on(event, cb); }
   if (!event.length) { return; }
   return event.map(name => {
     global.__EM__.on(name, cb);
   });
 },
	 once	= x('once'),
	 off	= x('off');

export default {
  emit,
  on,
  once,
  off
};

export {
		emit
	,	on
	,	once
	,	off
};
