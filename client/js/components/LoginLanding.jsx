import React, { Component } from 'react';
import classNames from 'classnames';

import FBLogin from './FBLogin.jsx';
import SpotifyLogin from './SpotifyLogin.jsx';

class LoginLanding extends Component {
    constructor() {
        super();

        this.state = {
            fbLoggedIn: false,
            spotifyLoggedIn: false
        };
    }

    _facebookLoggedIn() {
        this.setState({
            fbLoggedIn: true
        });
        if (this.state.spotifyLoggedIn && this.state.fbLoggedIn)
            this.props.loggedIn();
    }

    _spotifyLoggedIn() {
        this.setState({
            spotifyLoggedIn: true
        });
        if (this.state.spotifyLoggedIn && this.state.fbLoggedIn)
            this.props.loggedIn();
    }

    render() {
        return (
            <div className={classNames('app-container')}>
                <div className={classNames('header-text', 'title')}>tuneup</div>
                <div className={classNames('header-text', 'sub')}>created by zb</div>
                <FBLogin loggedIn={this._facebookLoggedIn.bind(this)}/>
                <SpotifyLogin loggedIn={this._spotifyLoggedIn.bind(this)}/>
            </div>
        );
    }
}

export default LoginLanding;