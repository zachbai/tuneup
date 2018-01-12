import React, { Component } from 'react';
import classNames from 'classnames';
import querystring from 'querystring';

function SpotifyLogin(props) {
    return (
        <div 
            className={classNames('button', 'spotify')}
            onClick={props.onClick}
        >
            Log in with Spotify
        </div>
    ) 
}

export default SpotifyLogin;