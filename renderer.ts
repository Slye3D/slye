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
 * This file contains Render class which renders a Slye presentation
 * using Three.js.
 * It is implemented to be used for:
 * 1) Player
 * 2) Thumbnail Generator
 */

import * as types from "./types";
import * as util from "./util";

interface SlyeRenderer {
  canvas: HTMLCanvasElement;
  setSize(width: number, height: number): void;
  render(): void;
  goTo(id: string): void;
}

export class Renderer implements SlyeRenderer {
  canvas: HTMLCanvasElement;
  private steps: types.Step[];
  private uuid2id: Map<string, number>;

  constructor(presentation: types.Presentation) {
    this.steps = [];
    this.uuid2id = new Map();
    let id = 0;
    for (const key of presentation.order) {
      if (presentation.steps[key]) {
        const s = util.stepDeg2Rad(presentation.steps[key]);
        this.steps.push(s);
        this.uuid2id.set(key, id);
        id++;
      } else {
        throw new Error("Unsupportyed file");
      }
    }
  }

  // Public APIs
  setSize(width: number, height: number) {
    // TODO
  }

  render() {
    // TODO
  }

  goTo(id: string) {
    const index = this.uuid2id.get(id);
    // TODO
  }
}
