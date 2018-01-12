import { combineReducers } from 'redux';
import TuneupActionTypes from '../actions/TuneupActionTypes';
import shared from '../core/shared';

import AuthReducer from './AuthReducer';
import UserReducer from './UserReducer';

const initialState = {
    userState: {
        spotifyId: '',
        userName: '',
        userImage: '',
        currentTrack: {
            trackId: '',
            name: '',
            artist: '',
            album: '',
            albumArt: '',
            year: '',
            duration: 0
        },
        recents: [], 
        followers: [], 
        following: [],
    },
    authState: {
        loggedInFacebook: false,
        loggedInSpotify: false,
        userRegistered: true,
    }
};

const TuneupReducer = combineReducers({
    userState: combineReducers(UserReducer),
    authState: combineReducers(AuthReducer)
});

export default TuneupReducer;
