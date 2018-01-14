import React from 'react';
import classNames from 'classnames';

import Landing from '../containers/Landing';
import HeaderView from './HeaderView';
import FeedView from './FeedView';

const App = (props) => {
	if (!props.loggedIn)
		return <Landing/>;

	return ( //app
		<div className={classNames('app-container')}>
			<HeaderView />
			<FeedView />
		</div>
	);
};

export default App;