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

/**
 * In Slye we use `step` to represent `slide`
 * Each presentation has a some steps and each step has components inside it,
 * by having this class we would be able to manage step configs later
 * For example allowing each step to have a diffrent font, color and more,,,
 */
export class Step {
  /**
   * Each step has a uuid so we can change steps order just by changing an
   * array (`Presentation.path`)
   */
  readonly uuid: string;

  /**
   * We plug steps to the presentaion using this function,
   * it does the same thing as `Presentaion.push2stack`.
   */
  stack: (action: Action<any, Step>) => void;

  /**
   * List of components
   */
  private components: Map<string, Component> = new Map();

  /**
   * Initilize current step.
   */
  constructor() {
    this.uuid = uuid();
  }

  /**
   * Manage action stack.
   * @see Presentaion.push2stack
   */
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

  /**
   * Adds a component to step.
   */
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
