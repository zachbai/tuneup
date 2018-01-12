const Redis = require("ioredis");

const UserSchema = require("./UserSchema.js");
const TrackSchema = require("./TrackSchema.js");

var state = {
	db: null,
};

exports.connect = () => {
	state.db = new Redis();
}

exports.get = () => {
	return state.db;
}

exports.addUser = (user) => { // add user to db
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}
	
	// add user to all user set
	return new Promise((resolve, reject) => {
		state.db.sadd(UserSchema.userSetKey, user.spotifyId); 

		// set user's profile
		state.db.hmset(UserSchema.userKey(user.spotifyId), [
			UserSchema.usernameKey, user.username,
			UserSchema.spotifyIdKey, user.spotifyId, 
			UserSchema.facebookIdKey, user.facebookId,
			UserSchema.userImageKey, user.imageUrl,
			UserSchema.currentTrackKey, user.currentTrackId, 
			UserSchema.spotifyAccessKey, user.spotifyAccessToken, 
			UserSchema.spotifyRefreshKey, user.spotifyRefreshToken,
			UserSchema.lastUpdatedKey, user.lastUpdated 
		]);

		// set user's list of followers
		user.followers.forEach(function(followerId) {
			state.db.sadd(UserSchema.userFollowersKey(user.spotifyId), followerId);
		})

		// set user's list of following
		user.following.forEach(function(followingId) {
			state.db.sadd(UserSchema.userFollowingKey(user.spotifyId), followingId);
		})

		// set user's recent tracks
		user.recents.forEach(function(object) {
			state.db.lpush(UserSchema.userRecentsKey(user.spotifyId), object.track.id);
		})
		resolve();
	});
};

exports.addFollowerForUser = function(userId, followerId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(UserSchema.userFollowersKey(userId), followerId);
	return;
};

exports.addFollowingForUser = function(userId, followingId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.sadd(UserSchema.userFollowingKey(userId), followingId);
	return;
};

exports.updateCurrentForUser = function(userId, trackId) {
	if (!state.db) {
		console.error("DB is not connected.");
		return null;
	}

	state.db.hset(UserSchema.userKey(userId), [UserSchema.currentTrackKey, trackId]);
	return;
};

exports.getFollowersForUser = function(userId) {
	console.log(UserSchema.userFollowersKey(userId));
	return new Promise((resolve, reject) => {
		state.db.smembers(UserSchema.userFollowersKey(userId), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});
	});
};

exports.getFollowingForUser = function(userId) {
	console.log(UserSchema.userFollowingKey(userId));
	return new Promise((resolve, reject) => {
		state.db.smembers(UserSchema.userFollowingKey(userId), (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});
	});
};

exports.getCurrentTrackForUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.hget(UserSchema.userKey(userId), UserSchema.currentTrackKey, (err, result) => {
			if (err) {
				reject(err);
			}

			resolve(result);
		});
	});
};

exports.getRecentsForUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.lrange(UserSchema.userRecentsKey(userId), 0, -1, (err, result) => {
			if (err || !result) {
				reject(err);
			}
			resolve(result);
		});
	});
};

exports.getUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.hmget(UserSchema.userKey(userId), [
			UserSchema.usernameKey, 
			UserSchema.spotifyIdKey,
			UserSchema.facebookIdKey,
			UserSchema.userImageKey,
			UserSchema.currentTrackKey,
			UserSchema.lastUpdatedKey
			], (err, result) => {
			if (err || !result) {
				console.error("Could not retrieve user profile.");
				reject(err);
			}
			userProfile = {
				username: result[0],
				spotifyId: result[1],
				facebookId: result[2],
				imageUrl: result[3],
				currentTrackId: result[4],
				lastUpdated: result[5]
			};

			resolve(userProfile);
		});
	});
};

exports.hasUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.sismember(UserSchema.userSetKey, userId, (err, result) => {
			resolve(result);
		});
	});
};

exports.getLastUpdatedForUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.hget(UserSchema.userKey(userId), UserSchema.lastUpdatedKey, 
		(err, result) => {
			if (err || !result) {
				console.error("Could not retrieve user's last updated timestamp.");
				reject(err);
			}

			resolve(result);
		});
	});
};

exports.setSpotifyAccessTokenForUser = (userId, newAccessToken) => {
	state.db.hset(UserSchema.userKey(userId), UserSchema.spotifyAccessKey, newAccessToken);	
	return;
};

exports.getSpotifyAccessTokenForUser = (userId) => {
	return new Promise((resolve, reject) => {
		state.db.hget(UserSchema.userKey(userId), UserSchema.spotifyAccessKey, (err, result) => {
			if (err) {
				reject(err);
			} else if (!result) {
				resolve();
			}

			resolve(result);
		});	
	});
};

exports.getSpotifyRefreshTokenForUser = userId => {
	return new Promise((resolve, reject) => {
		state.db.hget(UserSchema.userKey(userId), UserSchema.spotifyRefreshKey, (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});	
	});
};

exports.getFacebookIdForUser = userId => {
	return new Promise((resolve, reject) => {
		state.db.hget(UserSchema.userKey(userId), UserSchema.facebookIdKey, (err, result) => {
			if (err || !result) {
				reject(err);
			}

			resolve(result);
		});	
	});
};

exports.addTrack = track => {
	if (!state.db) {
		console.error("DB is not connected");
		return null;
	}

	return new Promise((resolve, reject) => {
		state.db.sadd(TrackSchema.trackSetKey, track.id);

		// set track information
		state.db.hmset(TrackSchema.trackKey(track.id), [
			TrackSchema.titleKey, track.title,
			TrackSchema.artistKey, track.artist,
			TrackSchema.albumKey, track.album,
			TrackSchema.artKey, track.albumArt,
			TrackSchema.durationKey, track.duration,
			TrackSchema.urlKey, track.url
		]);
		resolve(track);
	});
};

exports.hasTrack = trackId => {
	return new Promise((resolve, reject) => {
		state.db.sismember(TrackSchema.trackSetKey, trackId, (err, result) => {
			resolve(result);
		});
	});
};

exports.getTrack = trackId => {
	return new Promise((resolve, reject) => {
		state.db.hmget(TrackSchema.trackKey(trackId), [
			TrackSchema.titleKey,
			TrackSchema.artistKey,
			TrackSchema.albumKey,
			TrackSchema.artKey,
			TrackSchema.durationKey,
			TrackSchema.urlKey
		], (err, result) => {
			if (err) {
				console.error("Could not retrieve track information.");
				reject(err);
			} else if (!result[0]) {
				resolve(null);
			}
			
			trackInfo = {
				id: trackId,
				title: result[0],
				artist: result[1],
				album: result[2],
				albumArt: result[3],
				duration: result[4],
				url: result[5],
			};

			resolve(trackInfo);
		});
	});
};

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
