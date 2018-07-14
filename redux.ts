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
import { db } from "./fs";
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

export interface DocsState {}

export interface CreateAction {
  type: "NEW_PRESENTATION";
}

export type DocsAction = CreateAction;

function docs(state: DocsState = {}, action: DocsAction): DocsState {
  switch (action.type) {
    case "NEW_PRESENTATION":
      db.create().then(id => {
        location.hash = "#/editor/" + id;
      });
      break;
  }
  return state;
}

const reducer = combineReducers({
  auth,
  docs
});

export const store = createStore(reducer);
