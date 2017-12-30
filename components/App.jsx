import React, { Component } from 'react';
import classNames from 'classnames';

import FBLogin from './FBLogin.jsx';

class App extends Component {
	handleResponse(response) {
		console.log(response);
	}

	render() {
		return (
			<div>
				<div className={classNames('header-text', 'title')}>tuneup</div>
				<div className={classNames('header-text', 'sub')}>created by zb</div>
				<FBLogin/>
			</div>
		)
	}
}

module.exports = App;
