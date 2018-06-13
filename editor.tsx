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
import * as db from "./db";
import { Player } from "./player";
import * as types from "./types";
import { emptyStep, randomString, stepDeg2Rad } from "./util";

interface StepProps {
  step: types.Step;
  onDelete: () => void;
  onChange: (newStep: types.Step) => void;
}

class Step extends Component<StepProps, {}> {
  handleTextChange = (event) => {
    const newStep: types.Step = { ...this.props.step };
    newStep.text = event.target.value;
    this.props.onChange(newStep);
  };

  handleVec3Change = (field: types.StepVec3Props, axis: types.Axis, e) => {
    const newStep: types.Step = { ...this.props.step };
    newStep[field][axis] = e.target.value ? Number(e.target.value)
      : ("" as any);
    this.props.onChange(newStep);
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

  constructor(props) {
    super(props);
    // TODO Remove any.
    this.id = (this.props as any).match.params.id;
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
  }

  save = () => {
    console.log("Save to db...");
    this.data.steps = {};
    this.data.order = this.state.order;
    this.state.steps.forEach((step, key) => {
      this.data.steps[key] = step;
    });
    db.update(this.id, this.data);
  };

  handleNewStep = () => {
    this.handleSave();
    const id = randomString();
    this.state.steps.set(id, emptyStep());
    this.state.order.push(id);
    this.forceUpdate();
  }

  togglePlayer = () => {
    if (!this.state.isPlaying) this.handleSave();
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }

  handleStepChange = (id: string, newStep: types.Step) => {
    this.handleSave(2500);
    this.state.steps.set(id, newStep);
  }

  handleStepDelete = (id: string) => {
    this.state.steps.delete(id);
    this.forceUpdate();
  }

  handleSave = (t = 0) => {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout);
    }
    if (!t) return this.save();
    this.saveTimeout = setTimeout(this.save, t);
  }

  render() {
    if (this.state.loading) {
      // TODO Render a spinner.
      return <div>Loading</div>;
    }
    if (this.state.isPlaying) {
      const stepsArray = [];
      for (const key of this.state.order) {
        if (this.state.steps.has(key)) {
          stepsArray.push(stepDeg2Rad(this.state.steps.get(key)));
        }
      }
      return (
        <Player
          presentation={ this.data }
          onClose={ this.togglePlayer } />
      );
    }
    const steps = [];
    this.state.steps.forEach((step, id) => {
      steps.push(
        <Step
          key={ "step" + id }
          step={ step }
          onDelete={ this.handleStepDelete.bind(this, id) }
          onChange={ this.handleStepChange.bind(this, id) } />
      );
    });
    return (
      <div className="steps-list" >
        { ...steps }
        <button className="btn-icon new-step" onClick={ this.handleNewStep } />
        <button className="btn-icon play" onClick={ this.togglePlayer } />
      </div>
    );
  }
}
