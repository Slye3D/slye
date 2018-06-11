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

import { combineReducers, createStore } from "redux";
import * as db from "./db";
import * as types from "./types";

export interface AuthState {
  user?: types.User;
}

export interface LogoutAction {
  type: "LOGOUT";
}

export interface LoginAction {
  type: "LOGIN";
}

export interface SetUserAction {
  type: "SET_USER";
  user: types.User;
}

export type AuthAction = LogoutAction | LoginAction | SetUserAction;

function auth(state: AuthState = {}, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      db.login();
      break;
    case "LOGOUT":
      db.logout();
      break;
    case "SET_USER":
      return {
        ...state,
        user: (action as SetUserAction).user
      };
  }
  return state;
}

const reducer = combineReducers({
  auth
});

export const store = createStore(reducer);
