import React from 'react';

import Landing from '../containers/Landing';
import MainView from './MainView';

const App = (props) => {
	if (!props.loggedIn)
		return <Landing/>;

	return <MainView/>;
};

export default App;