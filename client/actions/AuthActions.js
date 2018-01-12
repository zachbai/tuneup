import TuneupActionTypes from './TuneupActionTypes';
import constants from '../core/constants';
import shared from '../core/shared';

const AuthActions = {
    loginFacebook(userId) {
        shared.cookies.set(constants.FACEBOOK_COOKIES_KEY, userId);
        return {
            type: TuneupActionTypes.LOGIN_FACEBOOK,
            facebookId
        };
    }, 

    startLoginSpotify(spotifyId) {
        window.open('/login/spotify',
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,'+
            'width=400,height=500'
        );
        window.addEventListener('storage', (data) => {
            if (data.key == "tuneup_authorized" && data.newValue == "true") 
                loginSpotify();
        });

        return {
            type: TuneupActionTypes.START_LOGIN_SPOTIFY
        }
    },

    loginSpotify() {
        return {
            type: TuneupActionTypes.LOGIN_SPOTIFY,
            spotifyId: shared.cookies.get(constants.SPOTIFY_COOKIES_KEY)
        };

    }
};

export default AuthActions;