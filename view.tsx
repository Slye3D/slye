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
import * as screenfull from "screenfull";
import { db } from "./fs";
import { Player } from "./player";
import * as types from "./types";

export interface ViewState {
  loading: boolean;
  presentation: types.Presentation;
  owner: types.User;
}

export class View extends Component<{}, ViewState> {
  state: ViewState = {
    loading: true,
    presentation: null,
    owner: null
  };
  playerRef: Player;

  async componentWillMount() {
    const id = (this.props as any).match.params.id;
    const presentation = await db.getPresentation(id);
    const owner = await db.queryUser(presentation.ownerId);
    this.setState({ loading: false, owner, presentation });
  }

  handleFullScreen = () => {
    if (screenfull.enabled) {
      screenfull.request(this.playerRef.playerDiv);
      this.playerRef.iFrame.focus();
    }
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" />;
    }

    const { owner } = this.state;

    return (
      <div id="view">
        <div className="player-wrapper">
          <Player
            ref={ r => this.playerRef = r }
            onClose={ () => null }
            presentation={ this.state.presentation } />
          <div
            className="full-screen"
            onClick={ this.handleFullScreen } />
        </div>
        <div className="author-info">
          <img
            className="avatar"
            src={ owner.photoURL } />
          <a className="name" href={ "#/profile/" + owner.uid }>
            { owner.firstname + " " + owner.lastname }
          </a>
        </div>
      </div>
    );
  }
}
