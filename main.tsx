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
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { onAuthStateChanged } from "./db";
import { store } from "./redux";
import { Router } from "./router";

onAuthStateChanged(user => {
  store.dispatch({ type: "SET_USER", user });
});

ReactDOM.render(
  <Provider store={ store } >
    <Router />
  </Provider>,
  document.getElementById("root")
);
