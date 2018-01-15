import TuneupActionTypes from '../actions/TuneupActionTypes';
import shared from '../core/shared';

const currentPlaybackInitialState = {
	isPlaying: false,
	progress: null,
	timestamp: null,
	device: {
		name: '',
		type: '',
		isActive: null,
		isRestricted: null, 
		volumePercent: null,
	},
	context: {
		type: null,
		url: ''
	},
	track: {
		id: '',
		name: 'No track currently playing',
		popularity: null,
		url: '',
		duration: null
	},
	artists: [''],
	album: {
		id: '',
		imageUrl: '',
		name: '',
		type: ''
	}
};


const initialState = {
	username: '',
	imageUrl: '',
	followers: [],
	following: [],
	recents: [],
	currentPlayback: currentPlaybackInitialState
};

const UserReducer = (state = initialState, action) => {
	switch(action.type) {
	case TuneupActionTypes.SET_USER_INFO:
		return Object.assign({}, state, {
			username: action.userInfo.username,
			imageUrl: action.userInfo.imageUrl
		});

	case TuneupActionTypes.ADD_FOLLOWER:
		return Object.assign({}, state, {
			'followers': [...state.followers, action.follower]
		}); 

	case TuneupActionTypes.REMOVE_FOLLOWER:
		return Object.assign({}, state, {
			'followers': state.followers.filter(follower => follower.spotifyId !== action.followerId)
		});

	case TuneupActionTypes.ADD_FOLLOWING:
		return Object.assign({}, state, {
			'following': [...state.following, action.following]
		}); 

	case TuneupActionTypes.REMOVE_FOLLOWING:
		return Object.assign({}, state, {
			'following': state.following.filter(following => following.spotifyId !== action.followingId)
		});

	case TuneupActionTypes.UPDATE_RECENTS:
		if (action.userId == shared.getSpotifyId)
			return Object.assign({}, state, {
				recents: action.recents
			});
		state.following.map(f => {
			if (f.spotifyId == action.userId)
				f.recents = action.recents;
		});
		state.followers.map(f => {
			if (f.spotifyId == action.userId)
				f.recents = action.recents;
		});
		return state;

	case TuneupActionTypes.UPDATE_CURRENT_PLAYBACK:
		if (action.userId == shared.getSpotifyId()) {
			return Object.assign({}, state, {
				currentPlayback: action.currentPlayback
			});
		}
		state.following.map(f => {
			if (f.spotifyId == action.userId)
				f.currentTrack = action.currentPlayback;
		});
		state.followers.map(f => {
			if (f.spotifyId == action.userId)
				f.currentTrack = action.currentPlayback;
		});
		return state;
	default:
		return state;
	}
};

export default UserReducer;

