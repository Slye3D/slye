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
import { Paper, RaisedButton } from 'material-ui';
// import styles
import 'src/css/Story.css';
// import components for this page
import Editor from './editor';
// import SDK
import { Story, Events } from 'SDK/API';

class StoryCom extends Component {
  constructor() {
    super();
    this.editor = <Editor />;
    Events.on('renderStoryNavbar', () => {
      this.forceUpdate();
    });
  }

  render() {
		// TODO: cache 'RaisedButton's and bind all DOM events
    const pureIicons	= Story.getIcons();
    const Icons		= [];
    let uuid;
    for (uuid in pureIicons) {
      Icons.push(
        <RaisedButton
          label={pureIicons[uuid].title}
          icon={pureIicons[uuid].icon}
          key={uuid}
          onClick={(...x) => pureIicons[uuid].emit('click', ...x)}
        />
			);
    }
    return (
      <div className="page">
        <div className="story-arrow" />
        <div id="story-btns-wrapper">{Icons}</div>
        <div id="story-editor-wrapper">
          {this.editor}
        </div>
      </div>
    );
  }
}

export default StoryCom;
