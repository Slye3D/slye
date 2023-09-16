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

import * as firebase from "firebase/app";
import { FS_CONFIG } from "./config";
import * as types from "./types";
import * as util from "./util";

import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, CollectionReference, addDoc, serverTimestamp, orderBy, where, limit, query, Firestore, collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export interface DB {
  // Social media
  queryLatest(): Promise<types.PresentationInfo[]>;
  queryProfile(uid: string): Promise<types.PresentationInfo[]>;
  getPresentation(id: string): Promise<types.Presentation>;
  getThumbnailLink(p: types.PresentationInfo): Promise<string>;
  // Create & edit presentation
  create(): Promise<string>;
  uploadThumbnail(p: types.PresentationInfo, blob: Blob | Uint8Array | ArrayBuffer): Promise<void>;
  update(id: string, p: types.Presentation): Promise<void>;
  // Authentication
  login(): void;
  logout(): void;
  onAuthStateChanged(cb: (u: types.User) => void): void;
}

export const db: DB = Object.create(null);
declare const exports: any;

export function enableFS() {
  const tmp = new FirestoreDB(FS_CONFIG);
  exports.db = tmp;
}

export function enableMock() {
  // TODO
}

class FirestoreDB implements DB {
  private auth: Auth;
  private db: Firestore;
  private collectionRef: CollectionReference;
  private storage: FirebaseStorage;

  constructor(config: any) {
    const firebaseApp = firebase.initializeApp(config);
    this.auth = getAuth(firebaseApp);
    this.db = getFirestore(firebaseApp)
    this.collectionRef = collection(this.db, "presentations");
    this.storage = getStorage(firebaseApp);
  }

  async queryLatest() {
    const q = query(this.collectionRef, orderBy("created", "desc"), limit(20));
    const snapshots = await getDocs(q);
    const out = [];
    snapshots.forEach((snap) => {
      const id = snap.id;
      const data = snap.data() as types.Presentation;
      out.push({ id, data, thumbnail: null });
    });
    return out;
  }

  async queryProfile(uid: string) {
    const q = query(this.collectionRef, where("owner.uid", "==", uid));
    const snapshots = await getDocs(q);
    const out = [];
    snapshots.forEach((snap) => {
      const id = snap.id;
      const data = snap.data() as types.Presentation;
      out.push({ id, data, thumbnail: null });
    });
    return out;
  }

  async getPresentation(id: string) {
    const docRef = doc(this.collectionRef, id);
    const snap = await getDoc(docRef);
    if (snap.exists) {
      return snap.data() as types.Presentation;
    } else {
      throw Error(`Presentation does not exist ${id}`);
    }
  }

  getThumbnailLink(p: types.PresentationInfo) {
    const path = thumbnailPath(p.data.owner.uid, p.id);
    const thumbRef = ref(this.storage, path);
    return getDownloadURL(thumbRef);
  }

  async create() {
    const u = this.auth.currentUser;
    const stepId = util.randomString();
    const presentation = {
      owner: {
        displayName: u.displayName,
        photoURL: u.photoURL,
        uid: u.uid,
      },
      steps: {
        [stepId]: util.emptyStep(),
      },
      created: serverTimestamp(),
      updated: serverTimestamp(),
      order: [stepId],
    };
    const doc = await addDoc(this.collectionRef, presentation);
    return doc.id;
  }

  async uploadThumbnail(p: types.PresentationInfo, blob: Blob | Uint8Array | ArrayBuffer) {
    const userId = p.data.owner.uid;
    const path = thumbnailPath(userId, p.id);
    await uploadBytes(ref(this.storage, path), blob);
  }

  async update(id: string, p: types.Presentation) {
    if (!ownsDoc(this.auth.currentUser, p)) {
      throw new Error("Not owned by this user.");
    }
    const docRef = doc(this.collectionRef, id);
    const newProps = {
      steps: p.steps,
      order: p.order,
      updated: serverTimestamp(),
    };
    await updateDoc(docRef, newProps);
  }

  login() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  logout() {
    return signOut(this.auth);
  }

  onAuthStateChanged(cb: (u: types.User) => void) {
    onAuthStateChanged(this.auth, cb);
  }
}

// Some util functions
export function thumbnailPath(userId: string, presentationId: string) {
  return `/data/${userId}/${presentationId}/thumb.png`;
}

export function ownsDoc(u: types.User, p: types.Presentation) {
  return u.uid === p.owner.uid;
}
