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
  <a className="preview" href={`#/view/${info.id}`} >
    <img src={ info.thumbnail } />
  </a>
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
        <h2>Latest presentations</h2>
        <div className="list">
          { presentations.map(x => <Preview info={ x } key={ x.id } />) }
        </div>
      </div>
    );
  }
}
