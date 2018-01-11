import React, { Component } from 'react';
import classNames from 'classnames';
import auth from '../core/auth.js';
import constants from '../core/constants.js';

import LoginLanding from './LoginLanding.jsx';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
		};
	}

	componentWillMount() {
		const tuneupToken = localStorage.getItem(constants.TUNEUP_TOKEN_LOCAL_STORAGE_KEY);
		if (tuneupToken) {
			this.setState({
				loggedIn: true
			});
		}
	}

	_loggedIn() {
		auth.getToken().then((res) => {
			if (res) {
				this.setState({
					loggedIn: true
				});
				return;
			} else {
				this.setState({
					loggedIn: false
				});
			}
		});
	}

	render() {
		if (!this.state.loggedIn) {
			return <LoginLanding loggedIn={this._loggedIn.bind(this)}/>;
		} 

		return ( //app
			<div>
				application
			</div>
		);
	}
}

module.exports = App;
