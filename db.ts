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

import * as types from "./types";

export async function queryLatest(): Promise<types.Presentation[]> {
  return [];
}

export async function queryPresentation(id: string)
  : Promise<types.Presentation> {
  return {
    steps: []
  };
}

export async function create(): Promise<string> {
  return "abc";
}

export async function update(id: string, p: types.Presentation) {

}
