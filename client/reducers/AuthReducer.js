import TuneupActionTypes from '../actions/TuneupActionTypes';
import shared from '../core/shared';

const initialState = shared.getTuneupToken() ? true : false;

const AuthReducer = {
    loggedInFacebook: (state = initialState, action) => {
        switch(action.type)  {
            case TuneupActionTypes.LOGIN_FACEBOOK:
                return Object.assign({}, state, {
                    loggedInFacebook: true
                });
            default:
                return state;
        }
    },
    loggedInSpotify: (state = initialState, action) => {
        switch(action.type)  {
            case TuneupActionTypes.LOGIN_FACEBOOK:
                return Object.assign({}, state, {
                    loggedInSpotify: true
                });
            default:
                return state;
        }
    }
};

export default AuthReducer;

