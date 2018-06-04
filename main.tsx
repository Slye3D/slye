import React, { Component } from "react";
import ReactDom from "react-dom";

class Step extends Component<{}, {}> {
  render() {
    return (
      <div className="step">
        <input type="text" placeholder="Text..." />
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
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
