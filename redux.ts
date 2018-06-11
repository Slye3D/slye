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

export interface UserState {
  user?: types.User;
}

export interface LoginAction {
  type: "LOGIN";
}

export interface SetUserAction {
  type: "SET_USER";
  user: types.User;
}

export type UserAction = LoginAction | SetUserAction;

function user(state: UserState = {}, action: UserAction): UserState {
  switch (action.type) {
    case "LOGIN":
      db.login();
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
  user
});
export const store = createStore(reducer);
