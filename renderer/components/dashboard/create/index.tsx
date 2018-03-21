/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2017 Slye Development Team. All Rights Reserved.
 *       Licence: MIT License
 */

import React, { Component } from 'react';
import { Paper, TextField, RaisedButton } from 'material-ui';
import Template from './template';
import Axios from 'SDK/Axios';

let send = false;
class Create extends Component {
  state={
    template: Object.keys(global.__templates__)[0],
    title: '',
    description: ''
  }

  create = () => !send && Axios.post('/fs/create', {
    template: this.state.template,
    title: this.state.title,
    description: this.state.description
  }).then((x) => {
    this.props.history.push(`/editor/${x.data.uuid}`);
  }) && (send = true)

  render() {
    return (
      <div className="dashboard-page">
        <h1>Create your next stunning presentation...</h1>
        <hr />
        <div className="dashboard-title-wrapper">
          <TextField
            fullWidth
            hintText="Presentation title..."
            defaultValue={this.state.title}
            onChange={(e) => this.state.title = e.target.value}
          />
        </div>

        <RaisedButton label="Create" primary onClick={this.create} />

        <div className="dashboard-title-wrapper">
          <TextField
            fullWidth
            hintText="Write your description..."
            floatingLabelText="Description (optional)"
            multiLine
            rows={5}
            defaultValue={this.state.description}
            onChange={(e) => this.state.description = e.target.value}
          />
        </div>

        <div className="dashboard-template-wrapper">
          {Object.keys(global.__templates__).map(name =>
            (<Template
              key={name}
              name={name}
              isSelected={name == this.state.template}
              onClick={() => this.setState({ name })}
            />)
					)}
        </div>
      </div>

    );
  }
}

export default Create;
