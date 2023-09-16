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

/**
 * Generates thumbnail of the given presentation and upload it to
 * Firebase storage
 */

import { db } from "./fs";
import { Renderer } from "./renderer";
import * as types from "./types";

async function presentationToBlob(p: types.Presentation): Promise<Blob> {
  const renderer = new Renderer(p);
  await renderer.init();
  renderer.setSize(512, 288);
  if (p.order.length > 0) {
    renderer.goTo(p.order[0], 0);
  }
  renderer.render(0);
  let resolve: (_: Blob) => void;
  const promise = new Promise<Blob>(r => resolve = r);
  renderer.canvas.toBlob(resolve);
  renderer.dispose();
  return await promise;
}

export async function saveThumbnail(id: string, p: types.Presentation) {
  const blob = await presentationToBlob(p);
  await db.uploadThumbnail({ id, data: p }, blob);
  console.log("uploaded thumbnail to server");
}
