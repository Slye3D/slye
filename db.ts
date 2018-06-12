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
import { store } from "./redux";
import * as types from "./types";
import * as util from "./util";

import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyASm8PZXgrnFzbEgaFo9WZbliJ8cviR9Xs",
  authDomain: "slye-161715.firebaseapp.com",
  databaseURL: "https://slye-161715.firebaseio.com",
  projectId: "slye-161715",
  storageBucket: "slye-161715.appspot.com",
  messagingSenderId: "1070119163797"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user: types.User) => {
  store.dispatch({ type: "SET_USER", user });
});

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const collectionRef = db.collection("presentations");

export async function queryLatest(): Promise<types.Presentation[]> {
  return [];
}

export async function getPresentation(id: string)
  : Promise<types.Presentation> {
    return null;
}

export async function create(): Promise<string> {
  const u = auth.currentUser;
  const id = util.randomString();
  const presentation = {
    owner: {
      displayName: u.displayName,
      photoURL: u.photoURL,
      uid: u.uid
    },
    steps: {
      [id]: util.emptyStep()
    },
    created: firebase.firestore.FieldValue.serverTimestamp(),
    updated: firebase.firestore.FieldValue.serverTimestamp(),
    order: [id]
  };
  console.log(presentation);
  const doc = await collectionRef.add(presentation);
  return doc.id;
}

export async function update(id: string, p: types.Presentation) {

}

export function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

export function logout() {
  return firebase.auth().signOut();
}
