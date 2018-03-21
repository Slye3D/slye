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
import { Paper, FloatingActionButton, FontIcon } from 'material-ui';
import TransformIcon from 'material-ui/svg-icons/action/open-with';

import 'src/css/Controls.css';

class Controls extends Component {
  render() {
    return (
      <Paper zDepth={3} id="controls-list">
        <FloatingActionButton id="controls-transform">
          <FontIcon className="material-icons">open_with</FontIcon>
        </FloatingActionButton>
        <FloatingActionButton id="controls-rotation">
          <FontIcon className="material-icons">3d_rotation</FontIcon>
        </FloatingActionButton>
        <FloatingActionButton id="controls-scale">
          <FontIcon className="material-icons">zoom_out_map</FontIcon>
        </FloatingActionButton>
      </Paper>
    );
  }
}

export default Controls;
