import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
	BrowserRouter as Router
	, Route
	, Link
} from 'react-router-dom'

// we assume there is a symbolic link in node_modules as src & SDK
// cd node_modules; ln -nsf ../app/src; ln -nsf ../app/SDK

import './css/index.css'
import './css/Fonts.css'
import registerServiceWorker from './registerServiceWorker'
import muiTheme from './theme.js'

import Dashboard from './components/dashboard'
import Editor from './components/editor'
import Presentation from './routes/Presentation'


ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
		<Router>
			<div id='#page'>
			<Route path="/" component={Dashboard}/>
			<Route path="/editor/:id" component={Editor}/>
			<Route path="/presentation" component={Presentation}/>
			</div>
		</Router>
	</MuiThemeProvider>
, document.getElementById('page'))

registerServiceWorker();
