var db = require('./db')

db.connect();

var user = {
	username: "zachbai",
	currentTrackId: "Skrrrrrt",
	spotifyAccessToken: 12345,
	spotifyRefreshToken: 67890,
	facebookId: "qwerty",
	followers: [
		"sj",
		"minos"
	],
	following: [
		"bobby",
		"chen"
	],
	recents: [
		"sylvan esso",
		"green day",
		"cardi b"
	]
};

db.addUser(user).then((result) => {
	db.getFollowersForUser(1)
		.then((followers) => {
			followers.forEach((f) => console.log("follower:", f));
		}).catch((err) => console.log("follower error:", err));

	db.getFollowingForUser(1)
		.then((followers) => {
			followers.forEach((f) => console.log("following:", f));
		}).catch((err) => console.log("following error:", err));

	db.getRecentsForUser(1)
		.then((recents) => {
			recents.forEach((r) => console.log("recent:", r));
		}).catch((err) => console.log("recent error:", err));

	db.getCurrentTrackForUser(1)
		.then((trackId) => console.log("current track:", trackId))
		.catch((err) => console.log("current track error:", err));

	db.getProfileForUser(1)
		.then((profile) => console.log(JSON.stringify(profile)));

	db.updateCurrentForUser(1, "Patti Cake");

	db.getCurrentTrackForUser(1)
		.then((trackId) => console.log("current track updated:", trackId))
		.catch((err) => console.log("current track update error:", err));

	db.getSpotifyAccessTokenForUser(1).then((accessToken) => console.log("spotify access token:", 
		accessToken))
		.catch((err) => console.log("spotify access token error:", err));

	db.getSpotifyRefreshTokenForUser(1).then((refreshToken) => console.log("spotify refresh token:",
		refreshToken)).catch((err) => console.log("spotify refresh token error:", err));

	db.getFacebookIdForUser(1).then((facebookId) => console.log("facebook id:", facebookId))
		.catch((err) => console.log("facebook id error:", err));
});

