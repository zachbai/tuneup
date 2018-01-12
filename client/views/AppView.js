import React, { Component } from 'react';
import classNames from 'classnames';
import auth from '../core/auth.js';
import constants from '../core/constants.js';

import LoginContainer from '../containers/LoginContainer';

const App = (props) => {
	if (!props.loggedIn)
		return <LoginContainer/>

	return ( //app
		<div>
			application
		</div>
	);
}

export default App;