import React, { Component } from 'react';
import classNames from 'classnames';

import Cell from '../containers/Cell.js';

class FeedView extends Component {
	render() {
		return this.props.following.map(f => <Cell user={f}/>);
	}
}

export default FeedView;