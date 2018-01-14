import User from './db/User.js';
import Track from './db/Track.js';
import spotify from './spotify.js';

class Tuneup {
	hasUser(spotifyId) {
		return User.hasUser(spotifyId);
	}

	async addUser(code, facebookId) {
		const newUser = await spotify.newUser(code, facebookId);
		return User.addUser(newUser).then(() => newUser.spotifyId);
	}

	getUser(spotifyId) {
		return User.getUser(spotifyId);
	}

	getFollowers(spotifyId) {
		return User.getFollowersForUser(spotifyId);
	}

	getFollowing(spotifyId) {
		return User.getFollowingForUser(spotifyId);
	}

	async getTrack(spotifyId, trackId) {
		const accessToken = await User.getSpotifyAccessTokenForUser(spotifyId);
		const hasTrack = await Track.hasTrack(trackId);
		if (hasTrack)
			return Track.getTrack(trackId);
		else {
			const track = await spotify.getTrackInfo(accessToken, trackId);
			await Track.addTrack(track);
			return track;
		} 
	}

	getTracks(spotifyId, trackIds) {
		const trackPromises = trackIds.map(trackId => {
			return this.getTrack(spotifyId, trackId);
		});

		return Promise.all(trackPromises);
	}

	async getRecents(spotifyId) {
		const trackIds = await User.getRecentTracksForUser(spotifyId);
		return this.getTracks(spotifyId, trackIds);
	}

	async getCurrentTrack(spotifyId) {
		const trackId = await User.getCurrentTrackForUser(spotifyId);
		return this.getTrack(spotifyId, trackId);
	}
}
export default new Tuneup();