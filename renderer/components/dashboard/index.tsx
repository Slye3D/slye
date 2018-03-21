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
import {
	BottomNavigation,
	BottomNavigationItem,
	Paper,
	FontIcon,
	FlatButton
} from 'material-ui';

import 'src/css/Dashboard.css';

import Create from './create/index';

const	settingsIcon	= <FontIcon className="material-icons">settings</FontIcon>,
  createIcon		= <FontIcon className="material-icons">create_new_folder</FontIcon>,
  recentIcon		= <FontIcon className="material-icons">alarm</FontIcon>;

class Dashboard extends Component {
  state={
    page: 'create'
  }

  constructor(props) {
    super();
    this.pages = {
      create: <Create history={props.history} />
    };
  }

  select = (page) => this.setState({ page })

  render() {
    const isSelected = (page) => this.state.page == page ? 'selected' : '';
    return (
      <div>
        <Paper id="dashboard-nav">
          <FlatButton
            icon={createIcon}
            label={''}
            className={isSelected('create')}
            onClick={this.select.bind(this, 'create')}
          />
          <FlatButton
            icon={recentIcon}
            label={''}
            className={isSelected('recent')}
            onClick={this.select.bind(this, 'recent')}
          />
          <FlatButton
            icon={settingsIcon}
            label={''}
            className={isSelected('settings')}
            onClick={this.select.bind(this, 'settings')}
          />
        </Paper>
        {this.pages[this.state.page] ? this.pages[this.state.page] : null}
      </div>
    );
  }
}

export default Dashboard;
