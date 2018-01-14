const path = require('path');
const db = require(path.resolve('./server_modules/db.js'));
const UserSchema = require('./schema/UserSchema.js');

/* 
User Information methods
 */
const addUser = user => { // add user to db
	const setUserFollowers = Promise.all(
		user.followers.map(followerId => {
			return addFollowerForUser(user.spotifyId, followerId);
		})
	);
	const setUserFollowing = Promise.all(
		user.following.map(followingId => {
			return addFollowingForUser(user.spotifyId, followingId);
		})
	);
	const setRecents = Promise.all(
		user.recents.map(trackId => {
			return addRecentTrackForUser(user.spotifyId, trackId);
		})
	);
	
	// add user to all user set
	return Promise.all([
		addUserToSet(user.spotifyId),
		setUserInfo(user),
		setUserFollowers,
		setUserFollowing,
		setRecents
	]);
};

const getUser = userId => {
	return db.get().hmget(UserSchema.userKey(userId), [
		UserSchema.usernameKey, 
		UserSchema.spotifyIdKey,
		UserSchema.facebookIdKey,
		UserSchema.userImageKey,
		UserSchema.currentTrackKey,
		UserSchema.lastUpdatedKey
	]).then(result => {
		return {
			username: result[0],
			spotifyId: result[1],
			facebookId: result[2],
			imageUrl: result[3],
			currentTrackId: result[4],
			lastUpdated: result[5]
		};
	});
};

const hasUser = userId => {
	return db.get().sismember(UserSchema.userSetKey, userId);
};

/* 
	Follower/Following methods
 */
const addFollowerForUser = (userId, followerId) => {
	return db.get().sadd(UserSchema.userFollowersKey(userId), followerId);
};

const getFollowersForUser = userId => {
	return db.get().smembers(UserSchema.userFollowersKey(userId));
};

const addFollowingForUser = (userId, followingId) => {
	return db.get().sadd(UserSchema.userFollowingKey(userId), followingId);
};

const getFollowingForUser = userId => {
	return db.get().smembers(UserSchema.userFollowingKey(userId));
};

/*
	Current/Recents methods
*/
const setCurrentTrackForUser = (userId, trackId) => {
	return db.get().hset(UserSchema.userKey(userId), [UserSchema.currentTrackKey, trackId]);
};

const getCurrentTrackForUser = userId => {
	return db.get().hget(UserSchema.userKey(userId), UserSchema.currentTrackKey);
};

const getLastUpdatedTimeForUser = userId => {
	return db.get().hget(UserSchema.userKey(userId), UserSchema.lastUpdatedKey);
};

const addRecentTrackForUser = (userId, trackId) => {
	return db.get().lpush(UserSchema.userRecentsKey(userId), trackId);
};

const addRecentTracksForUser = (userId, trackIds) => {
	return Promise.all(trackIds.map(trackId => addRecentTrackForUser(userId, trackId)));
};

const getRecentTracksForUser = userId => {
	return db.get().lrange(UserSchema.userRecentsKey(userId), 0, -1); 
};

/*
	Facebook/Spotify auth methods
*/
const setSpotifyAccessTokenForUser = (userId, newAccessToken) => {
	return db.get().hset(UserSchema.userKey(userId), UserSchema.spotifyAccessKey, newAccessToken);	
};

const getSpotifyAccessTokenForUser = (userId) => {
	return db.get().hget(UserSchema.userKey(userId), UserSchema.spotifyAccessKey);
};

const getSpotifyRefreshTokenForUser = userId => {
	return db.get().hget(UserSchema.userKey(userId), UserSchema.spotifyRefreshKey);
};

const getFacebookIdForUser = userId => {
	return db.get().hget(UserSchema.userKey(userId), UserSchema.facebookIdKey);
};


/*
	Private methods	
*/
const addUserToSet = userId => {
	return db.get().sadd(UserSchema.userSetKey, userId);
};

const setUserInfo = user => {
	return db.get().hmset(UserSchema.userKey(user.spotifyId), [
		UserSchema.usernameKey, user.username,
		UserSchema.spotifyIdKey, user.spotifyId, 
		UserSchema.facebookIdKey, user.facebookId,
		UserSchema.userImageKey, user.imageUrl,
		UserSchema.currentTrackKey, user.currentTrackId, 
		UserSchema.spotifyAccessKey, user.spotifyAccessToken, 
		UserSchema.spotifyRefreshKey, user.spotifyRefreshToken,
		UserSchema.lastUpdatedKey, user.lastUpdated 
	]);
};

module.exports = {
	// user info
	addUser,
	getUser,
	hasUser,
	
	// followers
	addFollowerForUser,
	getFollowersForUser,

	// following
	addFollowingForUser,
	getFollowingForUser,

	// current track
	setCurrentTrackForUser,
	getCurrentTrackForUser,
	getLastUpdatedTimeForUser,

	// recent tracks
	addRecentTrackForUser,
	addRecentTracksForUser,
	getRecentTracksForUser,

	// spotify, facebook info
	getSpotifyAccessTokenForUser,
	setSpotifyAccessTokenForUser,
	getSpotifyRefreshTokenForUser,
	getFacebookIdForUser,
};