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

interface IndexState {
  // TODO
  user: any;
}

export class Index extends Component<{}, IndexState> {
  handleLogin = () => {
    db.login();
  };

  unsubscribeCb = () => null;
  componentWillMount() {
    this.unsubscribeCb = db.onAuthChange(user => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.unsubscribeCb();
  }

  render() {
    return (
      <div id="index-page">
        <div className="header">
          <div className="logo" />
          <div className="login button raised blue">
            <div className="center" onClick={ this.handleLogin }>Login</div>
          </div>
        </div>
        <div className="presentations-list">

        </div>
      </div>
    );
  }
}
