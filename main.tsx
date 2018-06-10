import React, { Component } from "react";
import ReactDom from "react-dom";
import * as types from "./types";
import { Player } from "./player";
import { emptyStep, stepDeg2Rad } from "./util";

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
          value={ this.props.step.text }
          onChange={ this.handleTextChange }/>
        Position:
        <div className="position">
          <input
            type="number"
            placeholder="X"
            value={ this.props.step.position.x }
            onChange={ this.handleVec3Change.bind(this, "position", "x") } />
          <input
            type="number"
            placeholder="Y"
            value={ this.props.step.position.y }
            onChange={ this.handleVec3Change.bind(this, "position", "y") } />
          <input
            type="number"
            placeholder="Z"
            value={ this.props.step.position.z }
            onChange={ this.handleVec3Change.bind(this, "position", "z") } />
        </div>
        Orientation:
        <div className="orientation">
          <input
            type="number"
            placeholder="X"
            value={ this.props.step.orientation.x }
            onChange={ this.handleVec3Change.bind(this, "orientation", "x") } />
          <input
            type="number"
            placeholder="Y"
            value={ this.props.step.orientation.y }
            onChange={ this.handleVec3Change.bind(this, "orientation", "y") } />
          <input
            type="number"
            placeholder="Z"
            value={ this.props.step.orientation.z }
            onChange={ this.handleVec3Change.bind(this, "orientation", "z") } />
        </div>
      </div>
    );
  }
}

interface AppState {
  steps: types.Step[];
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
    try {
      const steps = localStorage.getItem("slye-presentation");
      if (!steps) throw new Error();
      this.state.steps = JSON.parse(steps);
    } catch (e) {
      this.state.steps = [ emptyStep("Hello Slye!") ]
    }
  }

  handleNewStep = () => {
    this.handleSave();
    this.setState(s => {
      s.steps.push(emptyStep());
      return s;
    });
  }

  togglePlayer = () => {
    this.handleSave();
    this.setState({
      isPlaying: !this.state.isPlaying
    });
  };

  handleStepChange = (i: number, newStep: types.Step) => {
    this.handleSave(750);
    const newSteps = [ ...this.state.steps ];
    newSteps[i] = newStep;
    this.setState({
      steps: newSteps,
    });
  };

  handleSave = (t = 10) => {
    if (this.saveTimeout !== undefined) {
      clearTimeout(this.saveTimeout)
    }
    this.saveTimeout = setTimeout(() => {
      const steps = JSON.stringify(this.state.steps);
      localStorage.setItem("slye-presentation", steps);
    }, t);
  }

  render() {
    if (this.state.isPlaying) {
      return (
        <Player
          steps={ this.state.steps.map(stepDeg2Rad) }
          onClose={ this.togglePlayer } />
      );
    }
    return (
      <div className="steps-list" >
        { this.state.steps.map((s, i) => (
          <Step
            key={ "step" + i }
            step={ s }
            onChange={ this.handleStepChange.bind(this, i) } />
        )) }
        <button className="btn-icon new-step" onClick={ this.handleNewStep } />
        <button className="btn-icon play" onClick={ this.togglePlayer } />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
