import TuneupActionTypes from '../actions/TuneupActionTypes';
import shared from '../core/shared';

const initialState = shared.getTuneupToken() ? true : false;

const AuthReducer = {
	loggedInFacebook: (state = initialState, action) => {
		switch(action.type) {
		case TuneupActionTypes.LOGIN_FACEBOOK:
			return true;
		case TuneupActionTypes.USER_LOG_OUT:
			return false;
		default:
			return state;
		}
	},
	loggedInSpotify: (state = initialState, action) => {
		switch(action.type) {
		case TuneupActionTypes.LOGIN_SPOTIFY:
			return true;
		case TuneupActionTypes.USER_LOG_OUT:
			return false;
		default:
			return state;
		}
	},
	userRegistered: (state = initialState, action) => {
		switch (action.type) {
		case TuneupActionTypes.USER_REGISTERED:
			return true;
		case TuneupActionTypes.USER_LOG_OUT:
			return false;
		default:
			return state;
		}
	},
};

export default AuthReducer;

