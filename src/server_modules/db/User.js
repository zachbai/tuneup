import db from '../db.js';
import UserSchema from './schema/UserSchema.js';

class User {
	constructor() {
		this.db = db.get();
	}

	/*
		User information methods
	*/
	addUser(user) { // add user to db
		const setUserFollowers = Promise.all(
			user.followers.map(followerId => {
				return this.addFollowerForUser(user.spotifyId, followerId);
			})
		);
		const setUserFollowing = Promise.all(
			user.following.map(followingId => {
				return this.addFollowingForUser(user.spotifyId, followingId);
			})
		);
		const setRecents = Promise.all(
			user.recents.map(trackId => {
				return this.addRecentTrackForUser(user.spotifyId, trackId);
			})
		);
		
		// add user to all user set
		return Promise.all([
			this.addUserToSet(user.spotifyId),
			this.setUserInfo(user),
			setUserFollowers,
			setUserFollowing,
			setRecents
		]);
	}

	getUser(userId) {
		return this.db.hmget(UserSchema.userKey(userId), [
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
	}

	hasUser(userId) {
		return this.db.sismember(UserSchema.userSetKey, userId);
	}

	/* 
		Follower/Following methods
	*/
	addFollowerForUser(userId, followerId) {
		return this.db.sadd(UserSchema.userFollowersKey(userId), followerId);
	}

	getFollowersForUser(userId) {
		return this.db.smembers(UserSchema.userFollowersKey(userId));
	}

	addFollowingForUser(userId, followingId) {
		return this.db.sadd(UserSchema.userFollowingKey(userId), followingId);
	}

	getFollowingForUser(userId) {
		return this.db.smembers(UserSchema.userFollowingKey(userId));
	}

	/*
		Current/Recents methods
	*/
	setCurrentTrackForUser(userId, trackId) {
		return this.db.hset(UserSchema.userKey(userId), [UserSchema.currentTrackKey, trackId]);
	}

	getCurrentTrackForUser(userId) {
		return this.db.hget(UserSchema.userKey(userId), UserSchema.currentTrackKey);
	}

	getLastUpdatedTimeForUser(userId) {
		return this.db.hget(UserSchema.userKey(userId), UserSchema.lastUpdatedKey);
	}

	addRecentTrackForUser(userId, trackId) {
		return this.db.lpush(UserSchema.userRecentsKey(userId), trackId);
	}

	addRecentTracksForUser (userId, trackIds) {
		return Promise.all(trackIds.map(trackId => this.addRecentTrackForUser(userId, trackId)));
	}

	getRecentTracksForUser(userId) {
		return this.db.lrange(UserSchema.userRecentsKey(userId), 0, -1); 
	}

	/*
		Facebook/Spotify auth methods
	*/
	setSpotifyAccessTokenForUser(userId, newAccessToken) {
		return this.db.hset(UserSchema.userKey(userId), UserSchema.spotifyAccessKey, newAccessToken);	
	}

	getSpotifyAccessTokenForUser(userId) {
		return this.db.hget(UserSchema.userKey(userId), UserSchema.spotifyAccessKey);
	}

	getSpotifyRefreshTokenForUser(userId) {
		return this.db.hget(UserSchema.userKey(userId), UserSchema.spotifyRefreshKey);
	}

	getFacebookIdForUser(userId) {
		return this.db.hget(UserSchema.userKey(userId), UserSchema.facebookIdKey);
	}


	/*
		Private methods	
	*/
	addUserToSet(userId) {
		return this.db.sadd(UserSchema.userSetKey, userId);
	}

	setUserInfo(user) {
		return this.db.hmset(UserSchema.userKey(user.spotifyId), [
			UserSchema.usernameKey, user.username,
			UserSchema.spotifyIdKey, user.spotifyId, 
			UserSchema.facebookIdKey, user.facebookId,
			UserSchema.userImageKey, user.imageUrl,
			UserSchema.currentTrackKey, user.currentTrackId, 
			UserSchema.spotifyAccessKey, user.spotifyAccessToken, 
			UserSchema.spotifyRefreshKey, user.spotifyRefreshToken,
			UserSchema.lastUpdatedKey, user.lastUpdated 
		]);
	}
}

export default new User();