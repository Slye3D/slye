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
import * as util from "./util";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyASm8PZXgrnFzbEgaFo9WZbliJ8cviR9Xs",
  authDomain: "slye-161715.firebaseapp.com",
  databaseURL: "https://slye-161715.firebaseio.com",
  projectId: "slye-161715",
  storageBucket: "slye-161715.appspot.com",
  messagingSenderId: "1070119163797"
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
const collectionRef = db.collection("presentations");
const storageRef = firebase.storage().ref();

export async function queryLatest()
  : Promise<types.PresentationInfo[]> {
  const query = collectionRef.orderBy("updated", "desc").limit(50);
  const snapshots = await query.get();
  const out = [];
  snapshots.forEach(snap => {
    const id = snap.id;
    const data = snap.data();
    out.push({ id, data, thumbnail: null });
  });
  for (const presentation of out) {
    const { id, data } = presentation;
    const path = thumbnailPath(data.owner.uid, id);
    const thumbRef = storageRef.child(path);
    presentation.thumbnail = await thumbRef.getDownloadURL();
  }
  return out.reverse();
}

export async function getPresentation(id: string): Promise<types.Presentation> {
  const docRef = collectionRef.doc(id);
  const snap = await docRef.get();
  if (snap.exists) {
    return snap.data() as types.Presentation;
  } else {
    throw Error(`Presentation does not exist ${id}`);
  }
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
  const doc = await collectionRef.add(presentation);
  return doc.id;
}

export async function update(id: string, p: types.Presentation) {
  if (!ownsDoc(auth.currentUser, p)) return;
  const docRef = collectionRef.doc(id);
  await docRef.update({
    steps: p.steps,
    order: p.order,
    updated: firebase.firestore.FieldValue.serverTimestamp()
  });
  console.log("saved");
}

export function ownsDoc(u: types.User, p: types.Presentation) {
  return u.uid === p.owner.uid;
}

export function login() {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
}

export function logout() {
  return firebase.auth().signOut();
}

export function onAuthStateChanged(cb: (u: types.User) => void) {
  firebase.auth().onAuthStateChanged(cb);
  firebase.auth().onAuthStateChanged((user: types.User) => {
  });
}

export function uploadThumbnail(id, blob) {
  const userId = auth.currentUser.uid;
  const path = thumbnailPath(userId, id);
  const ref = storageRef.child(path);
  return ref.put(blob);
}

function thumbnailPath(userId, presentationId) {
  return `/data/${userId}/${presentationId}/thumb.png`;
}
