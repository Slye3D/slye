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
import { Consumer } from "./context";
import { Router } from "./router";

export class Slye extends Component<{}, {}> {
  render() {
    return (
      <div id="layout">
        <div className="header">
          <div className="logo" onClick={ () => location.hash = ""} />
          <Consumer>
            {({actions, values}) =>
            !values.Auth.isLoggedIn ? (
              <div className="login button raised blue">
                <div
                  className="center"
                  onClick={ actions.Auth.login }>Signin with Google</div>
              </div>
            ) : (
              <div className="drop user login button raised">
                <div
                  className="center">
                  Hello, { values.Auth.currentUser.displayName }
                  </div>
                <ul>
                  <li>
                    <a onClick={ actions.Presentations.create }>
                      New presentation
                    </a>
                  </li>
                  <li>
                    <a href={ `#/profile/${values.Auth.currentUser.uid}` }>
                      Your profile
                    </a>
                  </li>
                  <li>
                    <a onClick={ actions.Auth.logout }>
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )
            }
          </Consumer>
        </div>
        <Router />
      </div>
    );
  }
}
