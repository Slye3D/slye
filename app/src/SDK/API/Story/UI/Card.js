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

import React, { Component } from 'react';

class Card extends Component {
  componentDidMount() {
	  this._ismounted = true;
  }

  componentWillUnmount() {
	   this._ismounted = false;
  }

  constructor() {
    super();
    window.addEventListener('resize', () => {
      if (this._ismounted) { this.forceUpdate(); }
    });
  }

  render() {
    return (
      <div style={{
        backgroundColor: '#fff',
        padding: '10px',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
        margin: '5px',
        width: window.innerWidth - 514
      }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Card;
