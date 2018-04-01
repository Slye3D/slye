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

import { Step } from "./step";
import { Template } from "./template";

/**
 * An action is somewhat an object containg two property
 *   1. attach
 *   2. detach
 * In Slye we don't change any property directly instead we use an action
 * which helps us easily undo things and do stuff related to revision and etc.
 *
 * @export
 * @interface Action
 * @template T
 * @template context
 */
export interface Action<T, context = Presentation> {
  attach: AttachAction<T, context>;
  detach: DetachAction<T, context>;
}
export type AttachAction<T, context> = (this: context, save: (object: T) => void) => Promise<void>;
export type DetachAction<T, context> = (this: context, data: T) => Promise<void>;

/**
 * This class is used to create new presentations
 * all the magic behind an Slye presentation will end up here.
 *
 * @export
 * @class Presentation
 */
export class Presentation {
  private steps: Map<string, Step> = new Map();
  private path: string[];
  private template: Template = null;
  private changeHeadQueue: number | boolean = false;

  /**
   * We don't modify anything directly.
   * Instead we push all actions into this array
   * and will execute the sequnce whenever needed.
   * @type {Array.<Action>} Array of actions
   * @memberof Presentation
   */
  actions: Array<Action<any>> = [];

  /**
   * Save current action (would be used for undo and redo)
   */
  private head: number;

  /**
   * This private property is used to hold backward data
   *
   * @private
   * @type {Map<number, any>}
   * @memberof Presentation
   */
  private saves: Map<number, any> = new Map();

  /**
   * push2stack is a private API to push an action into history array.
   *
   * @private
   * @template T
   * @param {Action<T>} action
   * @memberof Presentation
   */
  private push2stack<T>(action: Action<T>) {
    this.actions.splice(this.head + 1, Infinity, action);
    for (let i = this.head + 1; i < this.actions.length; ++i) {
      this.saves.delete(i);
    }
    this.changeHead(this.actions.length - 1);
  }

  /**
   * Change the current pointer to latest action (AKA head)
   *
   * @private
   * @param {number} newHead
   * @returns
   * @memberof Presentation
   */
  private async changeHead(newHead: number) {
    if ( this.changeHeadQueue ) {
      this.changeHeadQueue = newHead;
      return;
    }
    if (newHead === this.head) return;
    if (newHead > this.actions.length - 1) return;
    this.changeHeadQueue = true;
    if (newHead > this.head) {
      for (let i = this.head + 1; i <= newHead; ++i) {
        await this.actions[i].attach.call(this, (data) => this.saves.set(i, data));
      }
    } else {
      for (let i = this.head; i >= newHead; --i) {
        const data = this.saves.get(i);
        await this.actions[i].detach.call(this, data);
      }
    }
    this.head = newHead;
    const nextHead = this.changeHeadQueue;
    this.changeHeadQueue = false;
    if (typeof nextHead === "number") {
      this.changeHead(nextHead);
    }
  }

  /**
   * Inserts an step to the presenation at the given offset.
   * If no offset is given, then it'll insert step as the last step.
   *
   * @param {Step} step
   * @param {number} [offset]
   * @returns {void}
   * @memberof Presentation
   */
  insertStep(step: Step, offset?: number): void {
    this.push2stack<string>({
      async attach(save) {
        if (this.steps.get(step.uuid)) return;
        save(step.uuid);
        this.steps.set(step.uuid, step);
        if (!offset) {
          this.path.push(step.uuid);
        } else {
          this.path.splice(offset, 0, step.uuid);
        }
      },
      async detach(uuid) {
        this.steps.delete(uuid);
        this.path = this.path.filter(x => x !== uuid);
      }
    });
  }

  /**
   * Removes an step from presentation based on it's UUID.
   *
   * @param {string} uuid
   * @returns {void}
   * @memberof Presentation
   */
  removeStep(uuid: string): void {
    this.push2stack<[Step, number]>({
      async attach(save) {
        const step = this.getStepByUUID(uuid);
        const index = this.path.indexOf(step.uuid);
        save([step, index]);
        this.steps.delete(uuid);
        this.path = this.path.filter(x => x !== uuid);
      },
      async detach([step, index]) {
        if (!step) return;
        this.steps.set(step.uuid, step);
        this.path.splice(index, 0, step.uuid);
      }
    });
  }

  /**
   * Returns an step based on its UUID.
   *
   * @param {string} uuid UUID of the step you want to get.
   * @returns {Step} Step which the given uuid.
   * @memberof Presentation
   */
  getStepByUUID(uuid: string): Step {
    return this.steps.get(uuid);
  }

  /**
   * Changes template of the presenation.
   *
   * @param {Template} newTemplate your new template.
   * @memberof Presentation
   */
  setTemplate(newTemplate: Template) {
    const changeTemplate = async(template) => {
      if (this.template) await this.template.detach();
      this.template = template;
      this.template && this.template.attach();
    };
    this.push2stack<Template>({
      async attach(save) {
        save(this.template);
        await changeTemplate(newTemplate);
      },
      async detach(oldTemplate) {
        await changeTemplate(oldTemplate);
      }
    });
  }
}
