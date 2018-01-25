import React, { Component } from 'react';
import classNames from 'classnames';
import api from '../core/api';

import HeaderView from './HeaderView';
import Feed from '../containers/Feed';
import MyPlayback from '../containers/MyPlayback';

class MainView extends Component {
	componentWillMount() {
		api.initializeState();
	}

	render () {
		return ( //app
			<div className={classNames('app-container')}>
				<HeaderView />
				<MyPlayback />
				<Feed />
			</div>
		);
	}
}

export default MainView;