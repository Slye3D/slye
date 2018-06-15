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

import React, { Component } from "react";
import * as screenfull from "screenfull";
import * as db from "./db";
import { Player } from "./player";
import { saveThumbnail } from "./thumbnail";
import * as types from "./types";
import { emptyStep, randomString, stepDeg2Rad } from "./util";

interface StepProps {
  step: types.Step;
  onDelete: () => void;
  onChange: () => void;
}

class Step extends Component<StepProps, {}> {
  handleTextChange = (event) => {
    this.props.step.text = event.target.value;
    this.props.onChange();
  };

  handleVec3Change = (field: types.StepVec3Props, axis: types.Axis, e) => {
    this.props.step[field][axis] = e.target.value ? Number(e.target.value)
      : ("" as any);
    this.props.onChange();
  }

  handleDelete = () => {
    this.props.onDelete();
  }

  render() {
    return (
      <div className="step">
        <button className="delete" onClick={ this.handleDelete } />
        <input
          type="text"
          placeholder="Text..."
          defaultValue={ this.props.step.text }
          onChange={ this.handleTextChange }/>
        Position:
        <div className="position">
          <input
            type="number"
            placeholder="X"
            defaultValue={ this.props.step.position.x + "" }
            onChange={ this.handleVec3Change.bind(this, "position", "x") } />
          <input
            type="number"
            placeholder="Y"
            defaultValue={ this.props.step.position.y + "" }
            onChange={ this.handleVec3Change.bind(this, "position", "y") } />
          <input
            type="number"
            placeholder="Z"
            defaultValue={ this.props.step.position.z + "" }
            onChange={ this.handleVec3Change.bind(this, "position", "z") } />
        </div>
        Orientation:
        <div className="orientation">
          <input
            type="number"
            placeholder="X"
            defaultValue={ this.props.step.orientation.x + "" }
            onChange={ this.handleVec3Change.bind(this, "orientation", "x") } />
          <input
            type="number"
            placeholder="Y"
            defaultValue={ this.props.step.orientation.y + "" }
            onChange={ this.handleVec3Change.bind(this, "orientation", "y") } />
          <input
            type="number"
            placeholder="Z"
            defaultValue={ this.props.step.orientation.z + "" }
            onChange={ this.handleVec3Change.bind(this, "orientation", "z") } />
        </div>
      </div>
    );
  }
}

interface EditorState {
  loading: boolean;
  isPlaying: boolean;
  steps: Map<string, types.Step>;
  order: string[];
}

export class Editor extends Component<{}, EditorState> {
  state = {
    loading: true,
    isPlaying: false,
    steps: null,
    order: null
  };
  saveTimeout: number;
  readonly id: string;
  data: types.Presentation;
  closePlayer = false;

  constructor(props) {
    super(props);
    // TODO Remove any.
    this.id = (this.props as any).match.params.id;
  }

  handleFullscreenChange = () => {
    if (this.closePlayer) {
      this.togglePlayer();
    }
    this.closePlayer = !this.closePlayer;
  }

  async componentWillMount() {
    const steps = new Map<string, types.Step>();
    this.data = await db.getPresentation(this.id);
    for (const key in this.data.steps) {
      if (this.data.steps[key]) {
        steps.set(key, this.data.steps[key]);
      }
    }
    const order = this.data.order;
    this.setState({ loading: false, steps, order });
    screenfull.on("change", this.handleFullscreenChange);
  }

  componentWillUnmount() {
    screenfull.off("change", this.handleFullscreenChange);
  }

  updateData = () => {
    this.data.steps = {};
    this.data.order = this.state.order;
    this.state.steps.forEach((step, key) => {
      this.data.steps[key] = step;
    });
  }

  save = () => {
    console.log("Save to db...");
    this.updateData();
    db.update(this.id, this.data);
    saveThumbnail(this.id, this.data);
  }

  handleNewStep = () => {
    const id = randomString();
    this.state.steps.set(id, emptyStep());
    this.state.order.push(id);
    this.handleSave();
    this.forceUpdate();
  }

  togglePlayer = () => {
    if (!this.state.isPlaying) this.updateData();
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }

  handleStepChange = (id: string) => {
    this.handleSave(2500);
  }

  handleStepDelete = (id: string) => {
    this.state.steps.delete(id);
    const index = this.state.order.indexOf(id);
    this.state.order.splice(index, 1);
    this.handleSave();
    this.forceUpdate();
  }

  handleSave = (t = 0) => {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout);
    }
    if (!t) return this.save();
    this.saveTimeout = setTimeout(this.save, t);
  }

  handlePlayer = p => {
    if (!p) return;
    if (screenfull.enabled) {
      this.closePlayer = false;
      screenfull.request(p.playerDiv);
      p.iFrame.focus();
    }
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" />;
    }
    if (this.state.isPlaying) {
      const stepsArray = [];
      for (const key of this.state.order) {
        if (this.state.steps.has(key)) {
          stepsArray.push(stepDeg2Rad(this.state.steps.get(key)));
        }
      }
      return (
        <div id="editor">
          <Player
            presentation={ this.data }
            ref={ this.handlePlayer}
            onClose={ this.togglePlayer } />
        </div>
      );
    }
    return (
      <div id="editor">
        <div className="steps-list">
          { [...this.state.order].map(id => (
            <Step
              key={ "step" + id }
              step={ this.state.steps.get(id) }
              onDelete={ this.handleStepDelete.bind(this, id) }
              onChange={ this.handleStepChange.bind(this, id) } />
          )) }
          <button
            className="btn-icon new-step"
            onClick={ this.handleNewStep } />
          <button
            className="btn-icon play"
            onClick={ this.togglePlayer } />
        </div>
      </div>
    );
  }
}
