import User from './db/User';
import UserPlayback from './db/UserPlayback';
import spotify from './spotify';

class Tuneup {
	constructor() {
		this.socket = null;
	}

	async setSocket(socket) {
		this.socket = socket;
		const allUserIds = await User.getAllUsers();
		allUserIds.forEach(id => this.pollUser(id));
	}

	hasUser(spotifyId) {
		return User.hasUser(spotifyId);
	}

	async addUser(code) {
		try {
			const newUser = await spotify.newUser(code);
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
			const currentPlayback = await spotify.getCurrentPlayback(accessToken, spotifyId);
			const oldCurrentPlayback = await UserPlayback.getUserPlayback(spotifyId);
			if (!currentPlayback)
				return;
			if (currentPlayback.track.id !== oldCurrentPlayback.track.id) {
				if (this.socket) {
					this.socket.emit('current-updated', {
						userId: spotifyId,
						currentPlayback: currentPlayback
					});
				}
				UserPlayback.setUserPlayback(spotifyId, currentPlayback);	
			} else if (currentPlayback.isPlaying != oldCurrentPlayback.isPlaying) {
				if (this.socket) {
					this.socket.emit('current-updated-play-state', {
						userId: spotifyId,
						isPlaying: currentPlayback.isPlaying
					});
				}
				UserPlayback.setUserPlayback(spotifyId, currentPlayback);	
			}
		}, 2 * 1000);
	}

	getUser(spotifyId) {
		return User.getUser(spotifyId);
	}

	async getFollowers(spotifyId) {
		const followersIds = await User.getFollowersForUser(spotifyId);
		return Promise.all(followersIds.map(followerId => {
			return Promise.all([this.getCurrentPlayback(followerId),this.getUser(followerId)]).then(results => {
				results[1].currentPlayback = results[0];
				return results[1];
			});
		}));
	}

	async getFollowing(spotifyId) {
		const followingIds = await User.getFollowingForUser(spotifyId);
		return Promise.all(followingIds.map(followingId => {
			return Promise.all([this.getCurrentPlayback(followingId),this.getUser(followingId)]).then(results => {
				results[1].currentPlayback = results[0];
				return results[1];
			});
		}));
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
		return UserPlayback.getUserPlayback(spotifyId);
	}

	async getValidAccessToken(spotifyId) {
		const expiry = await User.getSpotifyAccessTokenExpiryForUser(spotifyId);
		if (Date.now() > expiry - 1000) {
			const refreshToken = await User.getSpotifyRefreshTokenForUser(spotifyId);
			const newAccessToken = await spotify.getNewAccessToken(refreshToken);	
			await Promise.all([
				User.setSpotifyAccessTokenForUser(spotifyId, newAccessToken.accessToken),
				User.setSpotifyAccessTokenExpiryForUser(spotifyId, newAccessToken.expiry)
			]);
			return newAccessToken.accessToken;
		}
		else
			return User.getSpotifyAccessTokenForUser(spotifyId);
	}

	async putNewTrack(spotifyId, spotifyUri) {
		const accessToken = await this.getValidAccessToken(spotifyId);
		return spotify.putNewTrack(accessToken, spotifyUri);
	}
}
export default new Tuneup();