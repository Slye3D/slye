/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import uuid from "uuid/v4";
import { Component } from "./component";
import { Action } from "./presentation";

export class Step {
  readonly uuid: string;
  stack: (action: Action<any, Step>) => void;
  private components: Map<string, Component> = new Map();

  constructor() {
    this.uuid = uuid();
  }

  push2stack<T>(action: Action<T, Step>) {
    // TODO for now we need to do `step.stack = sth` to set this var
    // so it should be done before anything...
    // and user would not be able to do any stuff with unmounted step.
    // SOLUTION using a queue to capute events when it's unmounted.
    if (!this.stack) return;
    Object.assign(action, {
      context: this.uuid
    });
    this.stack(action);
  }

  addComponent(component: Component) {
    if (!component) return;
    this.push2stack<string>({
      async attach(save) {
        save(component.uuid);
        this.components.set(component.uuid, component);
        // TODO Set position of component.
      },
      async detach(uuid) {
        this.components.delete(uuid);
      }
    });
  }
}
