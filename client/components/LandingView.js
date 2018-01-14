import React, { Component } from 'react';
import classNames from 'classnames';

import FacebookLoginButton from './FacebookLoginButton';
import SpotifyLoginButton from './SpotifyLoginButton';

class LandingView extends Component {
	render() {
		return (
			<div className={classNames('app-container')}>
				<div className={classNames('header-text', 'title')}>tuneup</div>
				<div className={classNames('header-text', 'sub')}>created by zb</div>
				<FacebookLoginButton onLogIn={this.props.onLoginFacebook}/>
				<SpotifyLoginButton onClick={this.props.onClickSpotify}/>
			</div>
		);
	}
}

export default LandingView;