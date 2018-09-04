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
import { HashRouter, Route, Switch } from "react-router-dom";

import { Editor } from "./editor";
import { Index } from "./index";
import { Profile } from "./profile";
import { View } from "./view";
import { Welcome } from "./welcome";

export class Router extends Component<{}, {}> {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" component={ Index } exact />
          <Route path="/view/:id" component={ View } exact />
          <Route path="/editor/:id" component={ Editor } exact />
          <Route path="/profile/:uid" component={ Profile } exact />
          <Route path="/welcome" component={ Welcome } exact />
        </Switch>
      </HashRouter>
    );
  }
}
