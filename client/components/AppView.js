import React, { Component } from 'react';
import classNames from 'classnames';
import auth from '../core/auth.js';
import constants from '../core/constants.js';

import Landing from '../containers/Landing';
import HeaderView from './HeaderView';
import FeedView from './FeedView';

const App = (props) => {
	if (!props.loggedIn)
		return <Landing/>

	return ( //app
		<div className={classNames('app-container')}>
			<HeaderView />
			<FeedView />
		</div>
	);
}

export default App;