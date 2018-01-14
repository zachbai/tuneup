import db from '../db';
import schema from './schema/UserSchema';

class User {
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
		
		// add user to all user set
		return Promise.all([
			this.addUserToSet(user.spotifyId),
			this.setUserInfo(user),
			setUserFollowers,
			setUserFollowing,
		]);
	}

	getUser(userId) {
		return db.get().hmget(schema.userKey(userId), [
			schema.usernameKey, 
			schema.spotifyIdKey,
			schema.facebookIdKey,
			schema.userImageKey,
			schema.timestampKey,
		]).then(result => {
			return {
				username: result[0],
				spotifyId: result[1],
				facebookId: result[2],
				imageUrl: result[3],
				timestamp: result[4]
			};
		});
	}

	hasUser(userId) {
		return db.get().sismember(schema.userSetKey, userId);
	}

	/* 
		Follower/Following methods
	*/
	addFollowerForUser(userId, followerId) {
		return db.get().sadd(schema.userFollowersKey(userId), followerId);
	}

	getFollowersForUser(userId) {
		return db.get().smembers(schema.userFollowersKey(userId));
	}

	addFollowingForUser(userId, followingId) {
		return db.get().sadd(schema.userFollowingKey(userId), followingId);
	}

	getFollowingForUser(userId) {
		return db.get().smembers(schema.userFollowingKey(userId));
	}

	/*
		Facebook/Spotify auth methods
	*/
	setSpotifyAccessTokenForUser(userId, newAccessToken) {
		return db.get().hset(schema.userKey(userId), schema.spotifyAccessKey, newAccessToken);	
	}

	getSpotifyAccessTokenForUser(userId) {
		return db.get().hget(schema.userKey(userId), schema.spotifyAccessKey);
	}

	setSpotifyAccessTokenExpiryForUser(userId, newExpiry) {
		return db.get().hset(schema.userKey(userId), schema.spotifyAccessExpiryKey, newExpiry);	
	}

	getSpotifyAccessTokenExpiryForUser(userId) {
		return db.get().hget(schema.userKey(userId), schema.spotifyAccessExpiryKey);
	}

	getSpotifyRefreshTokenForUser(userId) {
		return db.get().hget(schema.userKey(userId), schema.spotifyRefreshKey);
	}

	getFacebookIdForUser(userId) {
		return db.get().hget(schema.userKey(userId), schema.facebookIdKey);
	}


	/*
		Private methods	
	*/
	addUserToSet(userId) {
		return db.get().sadd(schema.userSetKey, userId);
	}

	setUserInfo(user) {
		return db.get().hmset(schema.userKey(user.spotifyId), [
			schema.usernameKey, user.username,
			schema.spotifyIdKey, user.spotifyId, 
			schema.facebookIdKey, user.facebookId,
			schema.userImageKey, user.imageUrl,
			schema.currentTrackKey, user.currentTrackId, 
			schema.spotifyAccessKey, user.spotifyAccessToken, 
			schema.spotifyRefreshKey, user.spotifyRefreshToken,
			schema.spotifyAccessExpiryKey, user.spotifyAccessTokenExpiry,
			schema.timestampKey, user.timestamp
		]);
	}
}

export default new User();