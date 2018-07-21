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
import { Slye } from "./app";
import { SlyeProvider } from "./context";
import { enableFS } from "./fs";

// Enable FireStore.
enableFS();

ReactDOM.render(
  <SlyeProvider>
    <Slye />
  </SlyeProvider>,
  document.getElementById("root")
);
