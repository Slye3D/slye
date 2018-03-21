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

import EventEmitter from "eventemitter3";

class EE {
  constructor() {
    this.__EE__ = new EventEmitter();
  }

  on() {
    return this.__EE__.on(...arguments);
  }

  once() {
    return this.__EE__.once(...arguments);
  }

  emit() {
    return this.__EE__.emit(...arguments);
  }

  off() {
    return this.__EE__.off(...arguments);
  }
}

export default EE;
