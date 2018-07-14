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
import { Slye } from "./app";
import { db, enableFS } from "./fs";
import { store } from "./redux";

// Enable FireStore.
enableFS();

db.onAuthStateChanged(user => {
  store.dispatch({ type: "SET_USER", user });
});

ReactDOM.render(
  <Provider store={ store } >
    <Slye />
  </Provider>,
  document.getElementById("root")
);
