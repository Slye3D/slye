import React, { Component } from "react";
import ReactDom from "react-dom";
import * as types from "./types";

interface StepProps {
  step: types.Step,
  onChange: (newStep: types.Step) => void;
}

class Step extends Component<StepProps, {}> {
  handleTextChange = (event) => {
    const newStep: types.Step = { ...this.props.step };
    newStep["text"] = event.currentTarget.value;
    this.props.onChange(newStep);
  };

  handleVec3Change = (field: types.StepVec3Props, axis: types.Axis, e) => {
    const newStep: types.Step = { ...this.props.step };
    newStep[field][axis] = Number(e.currentTarget.value);
    this.props.onChange(newStep);
  }

  render() {
    return (
      <div className="step">
        <input type="text" placeholder="Text..." onChange={ this.handleTextChange }/>
        Position:
        <div className="position">
          <input
            type="number"
            placeholder="X"
            onChange={ this.handleVec3Change.bind(this, "position", "x") } />
          <input
            type="number"
            placeholder="Y"
            onChange={ this.handleVec3Change.bind(this, "position", "y") } />
          <input
            type="number"
            placeholder="Z"
            onChange={ this.handleVec3Change.bind(this, "position", "z") } />
        </div>
        Orientation:
        <div className="orientation">
          <input
            type="number"
            placeholder="X"
            onChange={ this.handleVec3Change.bind(this, "orientation", "x") } />
          <input
            type="number"
            placeholder="Y"
            onChange={ this.handleVec3Change.bind(this, "orientation", "y") } />
          <input
            type="number"
            placeholder="Z"
            onChange={ this.handleVec3Change.bind(this, "orientation", "z") } />
        </div>
      </div>
    );
  }
}

interface AppState {
  steps: types.Step[]
}

class App extends Component<{}, AppState> {
  state = {
    steps: []
  };

  handleNewStep = () => {
    const newStep: types.Step = {
      text: "",
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0, y: 0, z: 0 }
    };
    this.setState(s => {
      s.steps.push(newStep);
      return s;
    });
  }

  handleStepChange = (i: number, newStep: types.Step) => {
    this.setState(s => {
      s[i] = newStep;
      return s;
    });
  };

  render() {
    return (
      <div className="steps-list" >
        { this.state.steps.map((s, i) => (
          <Step
            key={ "step" + i }
            step={ s }
            onChange={ this.handleStepChange.bind(this, i) } />
        )) }
        <button className="btn-icon new-step" onClick={ this.handleNewStep } />
        <button className="btn-icon play" />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
