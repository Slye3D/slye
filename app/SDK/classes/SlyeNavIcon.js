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

import EventEmitter from './EE';

class SlyeNavIcon extends EventEmitter {
  constructor(icon, title = '') {
    super();
    this.title		= title;
    this.icon		= icon;
    this.isVisible	= true;
  }

  show() {
    const o = this.isVisible;
    this.isVisible	= true;
    this.emit('show', o);
    global.__EM__.emit('renderStoryNavbar');
    return this;
  }

  hide() {
    const o = this.isVisible;
    this.isVisible	= false;
    this.emit('hide', o);
    global.__EM__.emit('renderStoryNavbar');
    return this;
  }

  toggle() {
    if (this.isVisible) { return this.hide(); }
    return this.show();
  }
}

export default SlyeNavIcon;
