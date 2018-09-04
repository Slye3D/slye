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

// After signing-up, show this page to user, so they can
// choose their username and give us other informations.

export interface WelcomeProps { }

export interface WelcomeState { }

export class Welcome extends Component<WelcomeProps, WelcomeState> {
  render() {
    return <div>Test</div>;
  }
}
