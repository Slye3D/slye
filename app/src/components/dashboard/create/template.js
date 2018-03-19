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

class Template extends Component {
  render() {
    const name = this.props.name;
    const isSelected = this.props.isSelected;
    return (
      <div
        className={`dashboard-template-box${isSelected ? ' selected' : ''}`}
        onClick={this.props.onClick}
      >
        <img src={`${__dirname}/templates/${name}/thumbnail.png`} alt={name} />
        <label>{global.__templates__[name].name}</label>
      </div>
    );
  }
}

export default Template;
