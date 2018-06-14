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

import { uploadThumbnail } from "./db";
import { Renderer } from "./renderer";
import * as types from "./types";

async function presentationToBlob(p: types.Presentation) {
  const renderer = new Renderer(p);
  await renderer.init();
  renderer.setSize(256, 144);
  if (p.order.length > 0) {
    renderer.goTo(p.order[0], 0);
  }
  renderer.render(0);
  let resolve;
  const promise = new Promise(r => resolve = r);
  renderer.canvas.toBlob(resolve);
  renderer.dispose();
  return await promise;
}

export async function saveThumbnail(id, p: types.Presentation) {
  const blob = await presentationToBlob(p);
  await uploadThumbnail(id, blob);
  console.log("uploaded thumbnail to server");
}
