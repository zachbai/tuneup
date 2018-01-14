const User = require('./db/User.js');
const Track = require('./db/Track.js');
const spotify = require('./spotify.js');

const hasUser = spotifyId => {
	return User.hasUser(spotifyId);
};

const addUser = async (code, facebookId) => {
	const newUser = await spotify.newUser(code, facebookId);
	return User.addUser(newUser).then(() => newUser.spotifyId);
};

const getUser = spotifyId => {
	return User.getUser(spotifyId);
};

const getFollowers = spotifyId => {
	return User.getFollowersForUser(spotifyId);
};

const getFollowing = spotifyId => {
	return User.getFollowingForUser(spotifyId);
};

const getTrack = async (spotifyId, trackId) => {
	const accessToken = await User.getSpotifyAccessTokenForUser(spotifyId);
	const hasTrack = await Track.hasTrack(trackId);
	if (hasTrack)
		return Track.getTrack(trackId);
	else {
		const track = await spotify.getTrackInfo(accessToken, trackId);
		await Track.addTrack(track);
		return track;
	} 
};

const getTracks = async (spotifyId, trackIds) => {
	const trackPromises = trackIds.map(trackId => {
		return getTrack(spotifyId, trackId);
	});

	return Promise.all(trackPromises);
};

const getRecents = async spotifyId => {
	const trackIds = await User.getRecentTracksForUser(spotifyId);
	return getTracks(spotifyId, trackIds);
};

const getCurrentTrack = async spotifyId => {
	const trackId = await User.getCurrentTrackForUser(spotifyId);
	return getTrack(spotifyId, trackId);
};

module.exports = {
	addUser,
	hasUser,
	getUser,
	getFollowers,
	getFollowing,
	getRecents,
	getTracks,
	getCurrentTrack
};