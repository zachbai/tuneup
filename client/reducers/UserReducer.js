import TuneupActionTypes from '../actions/TuneupActionTypes';

const UserReducer = {
    followers: (state = [], action) => {
        switch(action.type) {
            case TuneupActionTypes.ADD_FOLLOWER:
                return Object.assign({}, state, {
                    'followers': [...state.followers, action.follower]
                }); 

            case TuneupActionTypes.REMOVE_FOLLOWER:
                return Object.assign({}, state, {
                    'followers': state.followers.filter(follower => follower.spotifyId !== action.followerId)
                });
            default:
                return state;
        }
    },

    following: (state = [], action) => {
        switch(action.type) {
            case TuneupActionTypes.ADD_FOLLOWING:
                return Object.assign({}, state, {
                    'following': [...state.following, action.following]
                }); 
            case TuneupActionTypes.REMOVE_FOLLOWING:
                return Object.assign({}, state, {
                    'following': state.following.filter(following => following.spotifyId !== action.followingId)
                });
            default:
                return state;
        }
    },

    recents: (state = [], action) => {
        switch(action.type) {
            case TuneupActionTypes.UPDATE_RECENTS:
                if (action.userId == shared.getSpotifyId)
                    return Object.assign({}, state, {
                        recents: action.recents
                    });
                state.following.map(f => {
                    if (f.spotifyId == action.userId)
                        f.recents = action.recents;
                });
                state.follower.map(f => {
                    if (f.spotifyId == action.userId)
                        f.recents = action.recents;
                })
                return state;
            default:
                return state;
        }
    },

    currentTrack: (state = {}, action) => {
        switch(action.type) {
            case TuneupActionTypes.UPDATE_CURRENT_TRACK:
                if (action.userId == shared.getSpotifyId)
                    return Object.assign({}, state, {
                        currentTrack: action.currentTrack
                    });
                state.following.map(f => {
                    if (f.spotifyId == action.userId)
                        f.currentTrack = action.currentTrack;
                });
                state.follower.map(f => {
                    if (f.spotifyId == action.userId)
                        f.currentTrack = action.currentTrack;
                })
                return state;
            default:
                return state;
        }
    }
};

export default UserReducer;

