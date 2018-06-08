import React, { Component } from "react";
import ReactDom from "react-dom";

class App extends Component<{}, {}> {
  render() {
    return (
      <div>Hello World!</div>
    );
  }
}

ReactDom.render(<App />, document.getElementById("root"));
