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

import SlyeBase from './SlyeBase';
import { Object3D } from 'three';
import { hardRender } from 'SDK/API/Renderer';
import Events from 'SDK/API/Events';
import React, { Component } from 'react';

function reactComponent(render, that, state, cb, l) {
  return class X extends Component {
    componentDidMount() {
      l(true);
    }

    componentWillUnmount() {
      l(false);
    }

    constructor() {
      super();
      cb(this);
      this.state = state;
    }

    render() {
      return render.call(that);
    }
	};
}

class SlyeComponent extends SlyeBase {
	// this is result of render() function
  __three__ = null

  constructor(props) {
    super(...arguments);
    this.__three__ 		= this.render();
    this.reactComponent	= reactComponent(this.preview, this, props, (r) => {
      this._r_ = r;
    }, (s) => {
      this._rs_ = s;
      if (s) {
        this._r_.setState(this.props);
      }
    });
  }

  forceRerender() {
    if (!this.owner) { return; }
    const tmp	= this.render();
		// TODO: Bug tracker for plugins and 3-rd parties
    if (!(tmp === null || tmp instanceof Object3D)) { return; }
    this.__three__ = tmp;
    hardRender(this.owner);
  }

  set owner(val) {
    const oldOwner = this.__owner__;
    this.__owner__ = val;
    this.forceRerender();
    if (oldOwner) { hardRender(oldOwner); }
  }

  get owner() {
    return this.__owner__;
  }

  setProps(partialProps, callback) {
		// update __presentation__.components[this.uuid].props
    for (const key in partialProps) {
      this.props[key] = partialProps[key];
    }

		// I know x is not defined
		// todo fix this funcking bug with React
    if (this._rs_) { this._r_.setState(partialProps); }
    this.forceRerender();
  }

	// Should return a Three.js object
	// We use the result in `sence.add()` function
  render() {}
}

export default SlyeComponent;

//
// pos = [5,1,2]
// rot = [0,0,0]
//
// ele = new SlyeElement({})
// obj = ele.object
// if(!obj)
// return
//
// obj.position	= new THREE.Vector3(0,0,0)
// obj.rotation	= new THREE.Vector3(0,0,0)
//
// // Apply rotation
// obj.position.applyEulerAngles(rot[0], rot[1], rot[2], 'XYZ')
// obj.rotation	= rot
// // Transform object
// obj.position.add(pos)
//
//
// // slide is group of objects
// slide.add(obj)
