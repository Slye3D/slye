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

interface IndexProps {
  onLogin: () => void;
}

class Index extends Component<IndexProps, {}> {
  handleLogin = () => {
    this.props.onLogin();
  };

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

const mapStateToProps = state => {
  console.log(state);
  return { };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin() {
      dispatch({ type: "LOGIN" });
    }
  };
};

// tslint:disable-next-line:variable-name
export const IndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
