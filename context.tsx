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

import React from "react";
import { db } from "./fs";
import * as types from "./types";
import { goto } from "./util";

const { Provider, Consumer } = React.createContext<types.Context>(undefined);
export { Consumer };

interface State {
  values: types.Values;
}

export class SlyeProvider extends React.Component<{}, State> {
  state = {
    values: {
      Auth: {
        isLoggedIn: false
      },
      Presentations: {}
    }
  };

  actions: types.Actions;

  constructor(props) {
    super(props);
    this.actions = {
      Auth: {
        login() {
          db.login();
        },
        logout() {
          db.logout();
        }
      },
      Presentations: {
        create() {
          // TODO(qti3e) async create(): Promise<id>;
          db.create().then(id => {
            goto("/editor/" + id);
          });
        }
      }
    };
  }

  componentWillMount() {
    db.onAuthStateChanged(user => {
      // TODO(qti3e) Check if this is the first time user
      // logged in to the system, and if so show the welcome
      // page.
      this.setState({
        values: {
          ...this.state.values,
          Auth: {
            ...this.state.values.Auth,
            isLoggedIn: Boolean(user),
            currentUser: user
          }
        }
      }, () => {
        if (user && user.firstLogin) {
          goto("/welcome");
        }
      });
    });
  }

  render() {
    return (
       <Provider value={{ actions: this.actions, values: this.state.values }}>
        {this.props.children}
       </Provider>
    );
  }
}
