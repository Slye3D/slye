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

import { Story } from ",,/../SDK/API";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import React, { Component } from "react";
import Editor from "src/components/Editor";
import "../css/Story.css";

// Profile -> [profile, change profile photo, my files]
// Settings
// 	Title
// 	Description (Summery)
// 	Keywords
// 	Privilage
// 		Private
// 		Public
// 		Not-listed
// 			Support for passcode
// 		Add to team (Ads)
// Home (Back to Dashboard)
// Share (If is public or url only)
//

class StoryComponent extends Component {
  constructor() {
    super();
  }

  render() {
    const pureIicons	= Story.getIcons();
    const Icons		= [];
    let uuid;
    for (uuid in pureIicons) {
      Icons.push(
        <RaisedButton
          label={pureIicons[uuid].title}
          icon={pureIicons[uuid].icon}
          key={uuid}
          onClick={(...x) => pureIicons[uuid].emit("click", ...x)}
        />
      );
    }
    return (
      <div className="page">
        <div className="story-arrow" />
        <div id="story-btns-wrapper">{Icons}</div>
        <div id="story-editor-wrapper">
          <Editor />
        </div>
      </div>
    );
  }
}

export default StoryComponent;
