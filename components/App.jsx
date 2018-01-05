import React, { Component } from 'react';
import classNames from 'classnames';

import LoginLanding from './LoginLanding.jsx';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loggedIn: false,
		};
	}

	_loggedIn() {
		this.setState({
			loggedIn: true
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
