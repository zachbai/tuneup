const USER_ID_KEY = 'usr:id';
const USER_KEY = 'usr';
const USER_RECENTS_KEY = 'r';
const USER_FOLLOWING_KEY = 'fw';
const USER_FOLLOWERS_KEY = 'fr';

const USERNAME_KEY = 'un';
const SPOTIFY_ID_KEY = 'si';
const FACEBOOK_ID_KEY = 'f';
const USER_IMAGE_KEY = 'ui';
const CURRENT_TRACK_KEY = 'ct';
const SPOTIFY_ACCESS_TOKEN_KEY = 'sa';
const SPOTIFY_REFRESH_TOKEN_KEY = 'sr';
const LAST_UPDATED_KEY = 'lu';

/*
 * User Schema defined as:
 * All Users: set of user_ids
 * 
 * User: Hash keyed by spotifyId
 *	- user name
 *	- spotify ID 
 *  - facebook ID
 *  - image url
 *	- current track (track id)
 *	- spotify access token
 *	- spotify refresh token
 *  - last updated profile timestamp
 * 
 * User's following: 
 *	- set of following user ids
 *
 * User's followers:
 *	- set of follower user ids
 *
 * User's recent tracks:
 *	- list of recents (track ids)
 */

exports.userIdKey = USER_ID_KEY;
exports.userSetKey = USER_KEY;
exports.spotifyIdKey = SPOTIFY_ID_KEY;
exports.facebookIdKey = FACEBOOK_ID_KEY;
exports.usernameKey = USERNAME_KEY;
exports.userImageKey = USER_IMAGE_KEY;
exports.currentTrackKey = CURRENT_TRACK_KEY;
exports.spotifyAccessKey = SPOTIFY_ACCESS_TOKEN_KEY;
exports.spotifyRefreshKey = SPOTIFY_REFRESH_TOKEN_KEY;
exports.lastUpdatedKey = LAST_UPDATED_KEY;

const userKey = id => {
	return USER_KEY + ':' + id;
};

exports.userFollowingKey = (id) => {
	return userKey(id) + ':' + USER_FOLLOWING_KEY;
};

exports.userFollowersKey = (id) => {
	return userKey(id) + ':' + USER_FOLLOWERS_KEY;
};

exports.userRecentsKey = (id) => {
	return userKey(id) + ':' + USER_RECENTS_KEY;
};

exports.userKey = userKey;
