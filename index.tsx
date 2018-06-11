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
import { connect } from "react-redux";
import * as types from "./types";

interface IndexProps {
  onLogin(): void;
  onLogout(): void;
  createNew(): void;
  user?: types.User;
}

class Index extends Component<IndexProps, {}> {
  handleLogin = () => {
    this.props.onLogin();
  };

  handleLogout = () => {
    this.props.onLogout();
  };

  handleNewPresentation = () => {
    this.props.createNew();
  };

  render() {
    const { user } = this.props;
    return (
      <div id="index-page">
        <div className="header">
          <div className="logo" />
            { !user ? (
              <div className="login button raised blue">
                <div
                  className="center"
                  onClick={ this.handleLogin }>Login</div>
              </div>
            ) : (
              <div className="drop user login button raised">
                <div
                  className="center" >Hello, { user.displayName }</div>
                <ul>
                  <li><a onClick={ this.handleLogout }>Sign out</a></li>
                </ul>
              </div>
            ) }
        </div>
        <div className="presentations-list">

        </div>
        { user ? (
          <button
            className="btn-icon plus"
            onClick={ this.handleNewPresentation } />
        ) : null }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin() {
      dispatch({ type: "LOGIN" });
    },
    onLogout() {
      dispatch({ type: "LOGOUT" });
    },
    createNew() {
      dispatch({ type: "NEW_PRESENTATION" });
    }
  };
};

// tslint:disable-next-line:variable-name
export const IndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
