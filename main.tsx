import React, { Component } from "react";
import ReactDom from "react-dom";
import * as types from "./types";

class Step extends Component<{}, {}> {
  render() {
    return (
      <div className="step">
        <input type="text" placeholder="Text..." />
        Position:
        <div className="position">
          <input type="number" placeholder="X" />
          <input type="number" placeholder="Y" />
          <input type="number" placeholder="Z" />
        </div>
        Orientation:
        <div className="orientation">
          <input type="number" placeholder="X" />
          <input type="number" placeholder="Y" />
          <input type="number" placeholder="Z" />
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

  render() {
    console.log(this.state);
    return (
      <div className="steps-list" >
        <Step />
        <Step />
        <button className="new-step" onClick={ this.handleNewStep } />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
