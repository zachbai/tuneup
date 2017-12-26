var Redis = require("ioredis");

const USER_ID_KEY = "users:id";
const USER_KEY = "users";
const USER_RECENTS_KEY = "recents";
const USER_FOLLOWING_KEY = "following";
const USER_FOLLOWERS_KEY = "followers";

const USERNAME_KEY = "username";
const CURRENT_TRACK_KEY = "current_track";

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
	getNewUserId().then((newUserId) => {
		console.log("newuser:", newUserId);
		state.db.sadd(USER_KEY, newUserId); 

		// set user's profile
		state.db.hmset(userKey(newUserId), [USERNAME_KEY, user.username,
		CURRENT_TRACK_KEY, user.currentTrackId])

		// set user's list of followers
		user.followers.forEach(function(followerId) {
			state.db.sadd(userFollowersKey(newUserId), followerId);
		})

		// set user's list of following
		user.following.forEach(function(followingId) {
			state.db.sadd(userFollowingKey(newUserId), followingId);
		})

		// set user's recent tracks
		user.recents.forEach(function(trackId) {
			state.db.lpush(userRecentsKey(newUserId), trackId);
		})
	})

	return;
}

exports.addFollowerForUser = function(userId, followerId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(userFollowersKey(userId), followerId);
	return;
}

exports.addFollowingForUser = function(userId, followingId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(userFollowingKey(userId), followingId);
	return;
}

exports.updateCurrentForUser = function(userId, trackId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.hset(userKey(userId), [CURRENT_TRACK_KEY, trackId]);
	return;
}

exports.getFollowersForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.smembers(userFollowersKey(userId), (err, result) => {
			if (err || !result) {
				reject();
			}

			resolve(result);
		});
	});
}

exports.getFollowingForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.smembers(userFollowingKey(userId), (err, result) => {
			if (err || !result) {
				reject();
			}

			resolve(result);
		});
	});
}

exports.getCurrentTrackForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hget(userKey(userId), CURRENT_TRACK_KEY, (err, result) => {
			if (err || !result) {
				reject();
			}

			resolve(result);
		});
	});
}

exports.getRecentsForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.lrange(userRecentsKey(userId), 0, -1, (err, result) => {
			if (err || !result) {
				reject();
			}
			resolve(result);
		});
	});
}

exports.getProfileForUser = function(userId) {
	return new Promise((resolve, reject) => {
		state.db.hmget(userKey(userId), USERNAME_KEY, CURRENT_TRACK_KEY, (err, result) => {
			if (err || !result) {
				reject();
			}
			userProfile = {
				username: result[0],
				currentTrackId: result[1],
			};

			resolve(userProfile);
		});
	});
}

function userKey(id) {
	return USER_KEY + ":" + id;
}

function userFollowingKey(id) {
	return userKey(id) + ":" + USER_FOLLOWING_KEY;
}

function userFollowersKey(id) {
	return userKey(id) + ":" + USER_FOLLOWERS_KEY;
}

function userRecentsKey(id) {
	return userKey(id) + ":" + USER_RECENTS_KEY;
}

function getNewUserId() {
	if (!state.db.get(USER_ID_KEY)) {
		state.db.set(USER_ID_KEY, -1, handleSetError);
	}
	state.db.incr(USER_ID_KEY);
	const newUserId = null;
	return state.db.get(USER_ID_KEY);
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
