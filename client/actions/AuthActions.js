import TuneupActionTypes from './TuneupActionTypes';
import constants from '../core/constants';
import shared from '../core/shared';

export const loginFacebook = userId => {
    shared.cookies.set(constants.FACEBOOK_COOKIES_KEY, userId);
    return {
        type: TuneupActionTypes.LOGIN_FACEBOOK,
        facebookId: userId 
    };
}

export const startLoginSpotify = () => {
    return dispatch => {
        window.open('/login/spotify',
            'Spotify',
            'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,'+
            'width=400,height=500'
        );
        window.addEventListener('storage', data => {
            if (data.key == "tuneup_authorized" && data.newValue == "true") 
                return dispatch(loginSpotify());
        });
    };
}

const loginSpotify = () => {
    return {
        type: TuneupActionTypes.LOGIN_SPOTIFY
    };
}