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
  isPlaying: boolean;
  steps: Map<string, types.Step>;
}

export class Editor extends Component<{}, EditorState> {
  state = {
    isPlaying: false,
    steps: null
  };
  saveTimeout: number;

  constructor(props) {
    super(props);
    this.state.steps = new Map<string, types.Step>();
    this.state.steps.set(randomString(), emptyStep("Hello Slye!"));
  }

  handleNewStep = () => {
    this.handleSave();
    const id = randomString();
    this.state.steps.set(id, emptyStep());
    this.forceUpdate();
  }

  togglePlayer = () => {
    this.handleSave();
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  }

  handleStepChange = (id: string, newStep: types.Step) => {
    this.handleSave(750);
    this.state.steps.set(id, newStep);
  }

  handleStepDelete = (id: string) => {
    this.state.steps.delete(id);
    this.forceUpdate();
  }

  handleSave = (t = 10) => {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      // TODO
    }, t);
  }

  render() {
    if (this.state.isPlaying) {
      const stepsArray = [...this.state.steps.values()].map(stepDeg2Rad);
      return (
        <Player
          steps={ stepsArray }
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
