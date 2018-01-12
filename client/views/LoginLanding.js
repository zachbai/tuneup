import React, { Component } from 'react';
import classNames from 'classnames';

import FBLogin from './FBLogin';
import SpotifyLogin from './SpotifyLogin';

class LoginLanding extends Component {
    render() {
        return (
            <div className={classNames('app-container')}>
                <div className={classNames('header-text', 'title')}>tuneup</div>
                <div className={classNames('header-text', 'sub')}>created by zb</div>
                <FBLogin />
                <SpotifyLogin onClick={this.props.onClickSpotify}/>
            </div>
        );
    }
}

export default LoginLanding;