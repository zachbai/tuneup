import React, { Component } from 'react';
import classNames from 'classnames';

import Cell from '../containers/Cell.js';

class FeedView extends Component {
	render() {
		return <div className={classNames('feed-container')}>
			{ this.props.following.map(f => <Cell user={f}/>) }
		</div>;
	}
}

export default FeedView;