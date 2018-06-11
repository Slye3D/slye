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

import firebase from "firebase/app";
import * as types from "./types";

import "firebase/auth";

const config = {
  apiKey: "AIzaSyASm8PZXgrnFzbEgaFo9WZbliJ8cviR9Xs",
  authDomain: "slye-161715.firebaseapp.com",
  databaseURL: "https://slye-161715.firebaseio.com",
  projectId: "slye-161715",
  storageBucket: "slye-161715.appspot.com",
  messagingSenderId: "1070119163797"
};
firebase.initializeApp(config);

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

export async function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await firebase.auth().signInWithPopup(provider);
  console.log(result);
}

export function onAuthChange(cb: (user: any) => void) {
  return firebase.auth().onAuthStateChanged(cb);
}
