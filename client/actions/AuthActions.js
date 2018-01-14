import TuneupActionTypes from './TuneupActionTypes';
import constants from '../core/constants';
import shared from '../core/shared';
import auth from '../core/auth';

export const loggedInFacebook = userId => {
	shared.cookies.set(constants.FACEBOOK_COOKIES_KEY, userId);
	return {
		type: TuneupActionTypes.LOGGED_IN_FACEBOOK,
		facebookId: userId 
	};
};

export const startLoginSpotify = () => {
	return dispatch => {
		window.open('/login/spotify',
			'Spotify',
			'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,'+
            'width=400,height=500'
		);
		window.addEventListener('storage', data => {
			if (data.key == 'tuneup_authorized' && data.newValue == 'true') 
				return dispatch(loggedInSpotify());
		});
	};
};

const loggedInSpotify = () => {
	return dispatch => {
		auth.getToken().then((res) => {
			if (res)
				return dispatch(userRegistered());
		});
	};
};

const userRegistered = () => {
	return {
		type: TuneupActionTypes.USER_REGISTERED 
	};
};