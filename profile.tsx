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

interface ProfileState {
  isLoading: boolean;
  presentations: types.PresentationInfo[];
  user: types.User;
}

export class Profile extends Component<{}, ProfileState> {
  state = {
    isLoading: true,
    presentations: null,
    user: null
  };

  async componentWillMount() {
    const uid = (this.props as any).match.params.uid;
    const presentations = await db.queryProfile(uid);
    let user;
    if (presentations.length > 0) {
      user = presentations[0].data.owner;
    } else {
      // TODO Save users info in some document.
      // user = await db.getUser(uid);
    }
    this.setState({
      isLoading: false,
      presentations,
      user
    });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}
