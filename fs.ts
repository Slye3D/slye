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
  queryUser(uid: string): Promise<types.User>;
}

export const db: DB = Object.create(null);
declare const exports;

export function enableFS() {
  const tmp = new FirestoreDB(FS_CONFIG);
  exports.db = tmp;
}

export function enableMock() {
  // TODO
}

class FirestoreDB implements DB {
  private auth: firebase.auth.Auth;
  private db: firebase.firestore.Firestore;
  private collectionRef: firebase.firestore.CollectionReference;
  private usersCollectionRef: firebase.firestore.CollectionReference;
  private storageRef: firebase.storage.Reference;
  private currentUser: types.User;

  constructor(config) {
    firebase.initializeApp(config);
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
    });
    this.collectionRef = this.db.collection("presentations");
    this.usersCollectionRef = this.db.collection("users");
    this.storageRef = firebase.storage().ref();
  }

  private async exeQuery(
    query: firebase.firestore.Query
  ): Promise<types.PresentationInfo[]> {
    const snapshots = await query.get();
    const out: types.PresentationInfo[] = [];
    const promises = [];
    snapshots.forEach(async snap => {
      const id = snap.id;
      const data = snap.data() as types.Presentation;
      // TODO(qti3e) It's possible to optimize this part.
      const ownerInfo = this.queryUser(data.ownerId);
      promises.push(ownerInfo);
      out.push({ id, data, ownerInfo: await ownerInfo });
    });
    await Promise.all(promises);
    return out;
  }

  queryLatest(): Promise<types.PresentationInfo[]> {
    const query = this.collectionRef.orderBy("created", "desc").limit(20);
    return this.exeQuery(query);
  }

  queryProfile(uid: string): Promise<types.PresentationInfo[]> {
    const query = this.collectionRef.where("owner.uid", "==", uid);
    return this.exeQuery(query);
  }

  async getPresentation(id: string): Promise<types.Presentation> {
    const docRef = this.collectionRef.doc(id);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as types.Presentation;
    } else {
      const error = new Error(`Presentation does not exist ${id}`);
      error.name = types.ErrorCodes.PresentationNotFound;
      throw error;
    }
  }

  getThumbnailLink(p: types.PresentationInfo): Promise<string> {
    const path = thumbnailPath(p.ownerInfo.uid, p.id);
    const thumbRef = this.storageRef.child(path);
    return thumbRef.getDownloadURL();
  }

  async create(): Promise<string> {
    const stepId = util.randomString();
    const presentation = {
      owner: this.currentUser.uid,
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

  async uploadThumbnail(p: types.PresentationInfo, blob): Promise<void> {
    const userId = p.ownerInfo.uid;
    const path = thumbnailPath(userId, p.id);
    const ref = this.storageRef.child(path);
    await ref.put(blob);
  }

  async update(id: string, p: types.Presentation): Promise<void> {
    if (!ownsDoc(this.currentUser, p)) {
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

  async queryUser(uid: string): Promise<types.User> {
    const docRef = this.usersCollectionRef.doc(uid);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as types.User;
    } else {
      const error = new Error(`User does not exist ${uid}.`);
      error.name = types.ErrorCodes.UserNotFound;
      throw error;
    }
  }

  login(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  logout(): void {
    firebase.auth().signOut();
  }

  private async handleSignUp(): Promise<void> {
    const data = this.auth.currentUser;

    const user: types.User = {
      uid: data.uid,
      firstname: data.displayName,
      lastname: "",
      photoURL: data.photoURL,
    };

    this.currentUser = user;

    try {
      await this.usersCollectionRef.add(user);
    } catch (e) {
      // TODO(qti3e) Alert user, or try again?
    }
  }

  onAuthStateChanged(cb: (u: types.User) => void): void {
    firebase.auth().onAuthStateChanged(async (user: firebase.UserInfo) => {
      if (!user) return cb(undefined);
      try {
        this.currentUser = await this.queryUser(user.uid);
        cb(this.currentUser);
      } catch (e) {
        if (e.name === types.ErrorCodes.UserNotFound && this.auth.currentUser) {
          this.handleSignUp();
          this.currentUser.firstLogin = true;
          return cb(this.currentUser);
        }
        // TODO(qti3e) Handle this!
        console.error(e);
      }
    });
  }
}

// Some util functions
// TODO(qti3e) Move to util.ts
export function thumbnailPath(userId, presentationId) {
  return `/data/${userId}/${presentationId}/thumb.png`;
}

export function ownsDoc(u: types.User, p: types.Presentation) {
  return u.uid === p.ownerId;
}
