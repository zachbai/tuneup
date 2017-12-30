const Redis = require("ioredis");

const schema = require("./db_schema.js");

var state = {
	db: null,
};

exports.connect = function() {
	state.db = new Redis();
}

exports.get = function() {
	return state.db;
}

exports.addUser = function(user) { // add user to db
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}
	
	// add user to all user set
	return new Promise((resolve, reject) => {
		resolve(user.spotifyId);
	}).then((newUserId) => {
		state.db.sadd(schema.userSetKey(), newUserId); 

		// set user's profile
		state.db.hmset(schema.userProfileKey(newUserId), [schema.usernameKey(), user.username,
			schema.currentTrackKey(), user.currentTrackId, schema.spotifyAccessKey(),
			user.spotifyAccessToken, schema.spotifyRefreshKey(), user.spotifyRefreshToken,
			schema.spotifyIdKey(), user.spotifyId, schema.userImageKey(), user.imageUrl]);

		// set user's list of followers
		user.followers.forEach(function(followerId) {
			state.db.sadd(schema.userFollowersKey(newUserId), followerId);
		})

		// set user's list of following
		user.following.forEach(function(followingId) {
			state.db.sadd(schema.userFollowingKey(newUserId), followingId);
		})

		// set user's recent tracks
		user.recents.forEach(function(object) {
			state.db.lpush(schema.userRecentsKey(newUserId), object.track.id);
		})
		return;
	})
}

exports.addFollowerForUser = function(userId, followerId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(schema.userFollowersKey(userId), followerId);
	return;
}

exports.addFollowingForUser = function(userId, followingId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(schema.userFollowingKey(userId), followingId);
	return;
}

exports.updateCurrentForUser = function(userId, trackId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.hset(schema.userProfileKey(userId), [schema.currentTrackKey(), trackId]);
	return;
}

exports.getFollowersForUser = function(userId) {
	console.log(schema.userFollowersKey(userId));
	return new Promise((resolve, reject) => {
		state.db.smembers(schema.userFollowersKey(userId), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});
	});
}

exports.getFollowingForUser = function(userId) {
	console.log(schema.userFollowingKey(userId));
	return new Promise((resolve, reject) => {
		state.db.smembers(schema.userFollowingKey(userId), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});
	});
}

exports.getCurrentTrackForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hget(schema.userProfileKey(userId), schema.currentTrackKey(), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});
	});
}

exports.getRecentsForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.lrange(schema.userRecentsKey(userId), 0, -1, (err, result) => {
			if (err || !result) {
				reject(err);
			}
			resolve(result);
		});
	});
}

exports.getProfileForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hmget(schema.userProfileKey(userId), schema.usernameKey(), schema.currentTrackKey(), (err, result) => {
			if (err || !result) {
				console.err("Could not retrieve user profile.");
				reject(err);
			}
			userProfile = {
				username: result[0],
				currentTrackId: result[1],
			};

			resolve(userProfile);
		});
	});
}

exports.setSpotifyAccessTokenForUser = function(userId, newAccessToken) {
	state.db.hset(schema.userProfileKey(userId), schema.spotifyAccessKey(), newAccessToken);	
	return;
}

exports.getSpotifyAccessTokenForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hget(schema.userProfileKey(userId), schema.spotifyAccessKey(), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});	
	});
}

exports.getSpotifyRefreshTokenForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hget(schema.userProfileKey(userId), schema.spotifyRefreshKey(), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});	
	});
}

exports.getFacebookIdForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hget(schema.userProfileKey(userId), schema.facebookIdKey(), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});	
	});
}

function getNewUserId() {
	if (!state.db.get(schema.userIdKey())) {
		state.db.set(schema.userIdKey(), -1, handleSetError);
	}
	state.db.incr(schema.userIdKey());
	const newUserId = null;
	return state.db.get(schema.userIdKey());
}

function handleGetError(err, res) {
	if (err) {
		console.error("Error occurred in getting object:",  err);
		return err;
	}
	console.log("Got value ", res);
	return;
}

function handleSetError(err, res) {
	if (err) {
		console.error("Error occurred in setting object:",  err);
		return err;
	}
	console.log("Set value ", res);
	return;
}
