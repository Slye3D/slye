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

export interface ExtensionOption {
  title: string;
  dataType: "text" | "number";
  dataConfigs?: {
    min?: number;
    max?: number;
  };
}

/**
 * This class is base stone of all Slye extensions,
 * both templates and components...
 */
export abstract class Extension {
  /**
   * UUID of component/template so we can
   * track it in rendering loop and else where.
   */
  uuid: string;

  /**
   * The Slye's UI will call this function to get
   * configurable options of extension,
   * so it can display some forms to the client.
   */
  options(): void | ExtensionOption[] {}

  /**
   * Initilize UUID
   */
  constructor() {
    this.uuid = uuid();
  }

  /**
   * Tells component it's attached to scene,
   * so it should prepeare what it needs.
   */
  async attach() {}

  /**
   * Tells component it's removed from scene
   * so it should undo everything it did in
   * `attach()`
   */
  async detach() {}

  /**
   * This function is part of rendering loop.
   */
  async render() {}
}
