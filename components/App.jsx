import React, { Component } from 'react';
import classNames from 'classnames';

import FBLogin from './FBLogin.jsx';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			fbLoggedIn: false,
			spotifyLoggedIn: false
		};
	}

	componentWillMount() {
		// check if logged in through facebook AND spotify
		
		fetch('/check-login')
		.then(res => {
			return res.json();
		})
		.then(res => {
			console.log(res);
			this.setState({
				fbLoggedIn: res.fbLoggedIn,
				spotifyLoggedin: res.spotifyLoggedin
			});
		});
	}

	handleResponse(response) {
		console.log(response);
	}

	render() {
		if (!this.state.fbLoggedIn) {
			return (
				<div>
					<div className={classNames('header-text', 'title')}>tuneup</div>
					<div className={classNames('header-text', 'sub')}>created by zb</div>
					<FBLogin/>
				</div>
			);
		} else if (!this.state.spotifyLoggedin) {
			return (
				<div>
					<div className={classNames('header-text', 'title')}>tuneup</div>
					<div className={classNames('header-text', 'sub')}>created by zb</div>
					<div>log in with spotify</div>	
				</div>
			);
		}
		return ( //app
			<div>
				application
			</div>
		);
	}
}

module.exports = App;
