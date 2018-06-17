/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2018 Parsa Ghadimi. All Rights Reserved.
 *       Licence: MIT License
 */

import React, { Component } from "react";
import * as db from "./db";
import * as types from "./types";

interface IndexState {
  loading: boolean;
  presentations: types.PresentationInfo[];
}

// tslint:disable-next-line:variable-name
const Preview = ({ info }) => (
  <div className="preview">
    <a href={`#/view/${info.id}`} >
      <img src={ info.thumbnail } />
    </a>
    <div className="owner-box">
      <img src={ info.data.owner.photoURL } />
      <p>
        <span className="by">By </span>
        <a href={ "#/profile/" + info.data.owner.uid }>
          { info.data.owner.displayName }
        </a>
      </p>
    </div>
  </div>
);

export class Index extends Component<{}, IndexState> {
  state = {
    loading: true,
    presentations: null
  };

  async componentWillMount() {
    const presentations = await db.queryLatest();
    this.setState({ loading: false, presentations });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" />;
    }
    const { presentations } = this.state;
    return (
      <div id="index">
        <div className="description">
          <p>
          Slye is an early stage
          <a
            href="https://github.com/slye3d/slye"
            target="_blank"> open-source </a>
          web application to create 3D presentations powered by WebGL.<br />
          </p>
          <hr />
        </div>
        <div className="list">
          <h2>Recent presentations</h2>
          { presentations.map(x => <Preview info={ x } key={ x.id } />) }
        </div>
      </div>
    );
  }
}
