import React from 'react';
import classNames from 'classnames';

const SpotifyLoginButton = (props) => {
	return (
		<div 
			className={classNames('button', 'spotify')}
			onClick={props.onClick}
		>
            Log in with Spotify
		</div>
	); 
};

export default SpotifyLoginButton;