import React, { Component } from "react";
import ReactDom from "react-dom";

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

class App extends Component<{}, {}> {
  render() {
    return (
      <div className="steps-list" >
        <Step />
        <Step />
        <button className="new-step" />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
