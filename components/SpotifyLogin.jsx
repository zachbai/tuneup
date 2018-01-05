import React, { Component } from 'react';
import classNames from 'classnames';

class SpotifyLogin extends Component {
    _triggerLogIn() {
        window.open('/login/spotify',
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,'+
            'width=400,height=500'
        );
        window.addEventListener('storage', (data) => {
            console.log(data);
            if (data.key == "tuneup_token" && data.newValue == "success") {
                this.props.loggedIn();
            }
        });
    }

    render() {
       return (
            <div 
                className={classNames('button', 'spotify')}
                onClick={this._triggerLogIn.bind(this)}
            >
                Log in with Spotify
            </div>
       ) 
    }
}

export default SpotifyLogin;