import React from 'react';
import classNames from 'classnames';

const SpotifyLoginButton = (props) => {
	return (
		<div 
			className={classNames('spotify-login-button')}
			onClick={props.onClick}
		>
            Log in with Spotify
		</div>
	); 
};

export default SpotifyLoginButton;