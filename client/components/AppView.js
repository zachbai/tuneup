import React from 'react';
import classNames from 'classnames';

import Landing from '../containers/Landing';
import HeaderView from './HeaderView';
import Feed from '../containers/Feed';
import MyPlayback from '../containers/MyPlayback';

const App = (props) => {
	if (!props.loggedIn)
		return <Landing/>;

	return ( //app
		<div className={classNames('app-container')}>
			<HeaderView />
			<MyPlayback />
			<Feed />
		</div>
	);
};

export default App;