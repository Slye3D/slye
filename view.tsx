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
import { Player } from "./player";
import * as types from "./types";

export interface ViewState {
  loading: boolean;
  presentation: types.Presentation;
}

export class View extends Component<{}, ViewState> {
  state = {
    loading: true,
    presentation: null
  };

  async componentWillMount() {
    const id = (this.props as any).match.params.id;
    const presentation = await db.getPresentation(id);
    this.setState({ loading: false, presentation });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" />;
    }

    return (
      <div id="view">
        <Player
          onClose={ () => null }
          presentation={ this.state.presentation } />
        <div className="author-info">
          <img
            className="avatar"
            src={ this.state.presentation.owner.photoURL } />
          <h3 className="name">
            { this.state.presentation.owner.displayName }
          </h3>
        </div>
      </div>
    );
  }
}
