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
import { FS_CONFIG } from "./config";
import * as types from "./types";
import * as util from "./util";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

export interface DB {
  // Social media
  queryLatest(): Promise<types.PresentationInfo[]>;
  queryProfile(uid: string): Promise<types.PresentationInfo[]>;
  getPresentation(id): Promise<types.Presentation>;
  getThumbnailLink(p: types.PresentationInfo): Promise<string>;
  // Create & edit presentation
  create(): Promise<string>;
  uploadThumbnail(p: types.PresentationInfo, blob): Promise<void>;
  update(id: string, p: types.Presentation): Promise<void>;
  // Authentication
  login(): void;
  logout(): void;
  onAuthStateChanged(cb: (u: types.User) => void);
}

export const db: DB = Object.create(null);

export function enableFS() {
  const tmp = new FirestoreDB(FS_CONFIG);
  Object.assign(db, tmp);
}

export function enableMock() {
  // TODO
}

class FirestoreDB implements DB {
  private auth;
  private db;
  private collectionRef;
  private storageRef;

  constructor(config) {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.collectionRef = this.db.collection("presentations");
    this.storageRef = firebase.storage().ref();
  }

  async queryLatest() {
    const query = this.collectionRef.orderBy("created", "desc").limit(20);
    const snapshots = await query.get();
    const out = [];
    snapshots.forEach(snap => {
      const id = snap.id;
      const data = snap.data() as types.Presentation;
      out.push({ id, data, thumbnail: null });
    });
    return out;
  }

  async queryProfile(uid) {
    const query = this.collectionRef.where("owner.uid", "==", uid);
    const snapshots = await query.get();
    const out = [];
    snapshots.forEach(snap => {
      const id = snap.id;
      const data = snap.data() as types.Presentation;
      out.push({ id, data, thumbnail: null });
    });
    return out;
  }

  async getPresentation(id) {
    const docRef = this.collectionRef.doc(id);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as types.Presentation;
    } else {
      throw Error(`Presentation does not exist ${id}`);
    }
  }

  getThumbnailLink(p) {
    const path = thumbnailPath(p.data.owner.uid, p.id);
    const thumbRef = this.storageRef.child(path);
    return thumbRef.getdownloadurl();
  }

  async create() {
    const u = this.auth.currentUser;
    const stepId = util.randomString();
    const presentation = {
      owner: {
        displayName: u.displayName,
        photoURL: u.photoURL,
        uid: u.uid
      },
      steps: {
        [stepId]: util.emptyStep()
      },
      created: firebase.firestore.FieldValue.serverTimestamp(),
      updated: firebase.firestore.FieldValue.serverTimestamp(),
      order: [stepId]
    };
    const doc = await this.collectionRef.add(presentation);
    return doc.id;
  }

  uploadThumbnail(p, blob) {
    const userId = p.data.owner.uid;
    const path = thumbnailPath(userId, p.id);
    const ref = this.storageRef.child(path);
    return ref.put(blob);
  }

  async update(id: string, p: types.Presentation) {
    if (!ownsDoc(this.auth.currentUser, p)) {
      throw new Error("Not owned by this user.");
    }
    const docRef = this.collectionRef.doc(id);
    const newProps = {
      steps: p.steps,
      order: p.order,
      updated: firebase.firestore.FieldValue.serverTimestamp()
    };
    await docRef.update(newProps);
  }

  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
  }

  logout() {
    return firebase.auth().signOut();
  }

  onAuthStateChanged(cb) {
    firebase.auth().onAuthStateChanged(cb);
  }
}

// Some util functions
export function thumbnailPath(userId, presentationId) {
  return `/data/${userId}/${presentationId}/thumb.png`;
}

export function ownsDoc(u: types.User, p: types.Presentation) {
  return u.uid === p.owner.uid;
}
