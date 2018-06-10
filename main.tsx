import React, { Component } from "react";
import ReactDom from "react-dom";
import * as types from "./types";
import { Player } from "./player";
import { emptyStep, randomString, stepDeg2Rad } from "./util";

interface StepProps {
  step: types.Step,
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
    newStep[field][axis] = e.target.value ? Number(e.target.value) : ("" as any);
    this.props.onChange(newStep);
  }

  render() {
    return (
      <div className="step">
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

interface AppState {
  steps: Map<string, types.Step>;
  isPlaying: boolean;
}

class App extends Component<{}, AppState> {
  state = {
    steps: null,
    isPlaying: false
  };
  saveTimeout: number;
  
  constructor(props) {
    super(props);
    this.state.steps = new Map<string, types.Step>();
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
  };

  handleStepChange = (id: string, newStep: types.Step) => {
    this.handleSave(750);
    this.state.steps.set(id, newStep);
  };

  handleSave = (t = 10) => {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout)
    }
    this.saveTimeout = setTimeout(() => {
      // TODO
    }, t);
  }

  render() {
    if (this.state.isPlaying) {
      const stepsArray = [ ...this.state.steps.values() ].map(stepDeg2Rad);
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

ReactDom.render(<App />, document.getElementById("root"));
