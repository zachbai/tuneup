import User from './db/User';
import UserPlayback from './db/UserPlayback';
import spotify from './spotify';
import constants from './constants';

class Tuneup {
	hasUser(spotifyId) {
		return User.hasUser(spotifyId);
	}

	async addUser(code, facebookId) {
		try {
			const newUser = await spotify.newUser(code, facebookId);
			await User.addUser(newUser);
			this.pollUser(newUser.spotifyId);
			return newUser.spotifyId;
		} catch(err) {
			throw 'Could not add user';
		}
	}

	pollUser(spotifyId) {
		setInterval(async () => {
			const accessToken = await this.getValidAccessToken(spotifyId);
			const currentPlayback = await spotify.getCurrentPlayback(accessToken);
			const oldCurrentPlayback = await UserPlayback.getUserPlayback(spotifyId);
			if (currentPlayback.track.id != oldCurrentPlayback.track.id) {
				console.log(currentPlayback);
				UserPlayback.setUserPlayback(spotifyId, currentPlayback);	
			}

		}, 2 * 1000);
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
		// const accessToken = await User.getSpotifyAccessTokenForUser(spotifyId);
		const accessToken = await this.getValidAccessToken(spotifyId);
		return spotify.getTrackInfo(accessToken, trackId);
	}

	getTracks(spotifyId, trackIds) {
		const trackPromises = trackIds.map(trackId => {
			return this.getTrack(spotifyId, trackId);
		});

		return Promise.all(trackPromises);
	}

	async getCurrentPlayback(spotifyId) {
		const accessToken = await this.getValidAccessToken(spotifyId);
		return spotify.getCurrentPlayback(accessToken);
	}

	async getValidAccessToken(spotifyId) {
		const expiry = await User.getSpotifyAccessTokenExpiryForUser(spotifyId);
		if (Date.now() > expiry - 1000) {
			const refreshToken = await User.getSpotifyRefreshTokenForUser(spotifyId);
			const newAccessToken = await spotify.getNewAccessToken(refreshToken);	
			await Promise.all([
				User.setSpotifyAccessTokenForUser(newAccessToken.accessToken),
				User.setSpotifyAccessTokenExpiryForUser(newAccessToken.expiry)
			]);
			return newAccessToken.accessToken;
		}
		else
			return User.getSpotifyAccessTokenForUser(spotifyId);
	}
}
export default new Tuneup();