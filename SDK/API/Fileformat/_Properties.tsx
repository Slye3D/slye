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

const properties	= global.__presentation__.properties;

function set(objectUUID, key, value) {
  if (!properties[objectUUID]) { properties[objectUUID]	= {}; }
  properties[objectUUID][key] = value;
  return true;
}

function get(objectUUID, key) {
  // PLANNING: write it after finishing renderer loop
}

export default {
  set,
  get
};

export {
  set,
  get
};
