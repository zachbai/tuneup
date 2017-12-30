const USER_ID_KEY = "users:id";
const USER_KEY = "users";
const USER_RECENTS_KEY = "recents";
const USER_FOLLOWING_KEY = "following";
const USER_FOLLOWERS_KEY = "followers";

const USERNAME_KEY = "username";
const USER_IMAGE_KEY = "user_image";
const SPOTIFY_ACCESS_TOKEN_KEY = "spotify_access_token";
const SPOTIFY_REFRESH_TOKEN_KEY = "spotify_refresh_token";
const SPOTIFY_ID_KEY = "spotify_id_key";
const CURRENT_TRACK_KEY = "current_track";

/*
 * Schema defined as:
 * All Users: set of user_ids
 * User: Hash
 *	- set of following user ids
 *	- set of follower user ids
 *	- list of recents 
 *	- current track
 *	- spotify access token
 *	- spotify refresh token
 *	- spotify ID 
 *	- user name
 */

exports.userIdKey = () => {
	return USER_ID_KEY;
}

exports.userSetKey = () => {
	return USER_KEY;
}

exports.usernameKey = () => {
	return USERNAME_KEY;
}

exports.userImageKey = () => {
	return USER_IMAGE_KEY;
}

exports.currentTrackKey = () => {
	return CURRENT_TRACK_KEY;
}

exports.spotifyAccessKey = (id) => {
	return SPOTIFY_ACCESS_TOKEN_KEY;
}

exports.spotifyRefreshKey = (id) => {
	return SPOTIFY_REFRESH_TOKEN_KEY;
}

exports.spotifyIdKey = (id) => {
	return SPOTIFY_ID_KEY;
}

function userKey(id) {
	return USER_KEY + ":" + id;
}

exports.userFollowingKey = (id) => {
	return userKey(id) + ":" + USER_FOLLOWING_KEY;
}

exports.userFollowersKey = (id) => {
	return userKey(id) + ":" + USER_FOLLOWERS_KEY;
}

exports.userRecentsKey = (id) => {
	return userKey(id) + ":" + USER_RECENTS_KEY;
}

exports.userProfileKey = (id) => {
	return userKey(id);
}
