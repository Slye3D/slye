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

const presentation	= global.__presentation__;

function set(key, value) {
  value			= String(value);
  presentation.configs[key]	= value;
  return value;
}

function get(key, def) {
  let 	val = presentation.configs[key] || String(def),
    x	= parseFloat(val);
  if (isNaN(x)) { return val; }
  return x;
}

function remove(key) {
  if (!presentation.configs[key]) { return false; }
  delete presentation.configs[key];
  return true;
}

function incrBy(key, value) {
  value += parseFloat(get(key, 0));
  set(key, value);
  return value;
}

function incr(key) {
  return incrBy(key, 1);
}

export default {
  set,
  get,
  remove,
  incrBy,
  incr
};

export {
		set
	,	get
	,	remove
	,	incrBy
	,	incr
};
