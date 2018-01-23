import request from 'request-promise-native';
import querystring from 'querystring';
import config from '../config.js';

class Spotify {
	async newUser(code, facebookId) {
		const tokens = await this.getTokens(code);	
		const userInfo = await this.getUserProfile(tokens.accessToken);

		let newUser = {
			username: userInfo.username,
			spotifyAccessToken: tokens.accessToken,
			spotifyRefreshToken: tokens.refreshToken,
			spotifyAccessTokenExpiry: tokens.expiry,
			spotifyId: userInfo.spotifyId,
			facebookId: facebookId,
			imageUrl: userInfo.imageUrl,
			timestamp: Date.now(),
			followers: [],
			following: [],
		};

		return newUser;
	}

	async getTokens(code) {
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: config.spotifyRedirectUri,
				grant_type: 'authorization_code'
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(config.spotifyClientId + ':' + config.spotifyClientSecret).toString('base64'))
			},
			json: true
		};	

		const tokens = await request.post(authOptions).then(res => {
			return {
				accessToken: res.access_token,
				refreshToken: res.refresh_token,
				expiry: Date.now() + (res.expires_in - 60) * 1000
			};
		}).catch(err => {
			if (err.message === 'invalid id') {
				return null;
			}
			console.log(err);
		});

		return tokens;
	}

	async getNewAccessToken(refreshToken) {
		const options = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
			},
			headers: {
				'Authorization': 'Basic ' + (new Buffer(config.spotifyClientId + ':' + config.spotifyClientSecret).toString('base64'))
			},
			json: true
		};	

		const newAccessToken = await request.post(options).then(response => {
			return {
				accessToken: response.access_token,
				expiry: Date.now() + (response.expires_in - 60) * 1000
			};
		});
		return newAccessToken;
	}

	async getUserProfile(access_token) {
		let options = {
			url: 'https://api.spotify.com/v1/me',
			headers: {
				'Authorization': 'Bearer ' + access_token,
			},
			json: true
		};

		let profile = await request.get(options) .then(response => {
			return {
				username: response.display_name,
				imageUrl: response.images.length > 0 ? response.images[0].url : null,
				spotifyId: response.id
			};
		}).catch(err => console.log(err));
		return profile;
	}

	async getCurrentPlayback(access_token, spotifyId) {
		let options = {
			url: 'https://api.spotify.com/v1/me/player',
			headers: {
				'Authorization': 'Bearer ' + access_token,
			},
			json: true
		};

		const currentPlayback = await request.get(options).then(response => {
			if (response) {
				if (!response.item)
					return null;

				const device = {
					name: response.device.name,
					isActive: response.device.is_active,
					isRestricted: response.device.is_restricted,
					type: response.device.type,
					volumePercent: response.device.volume_percent
				};
				const context = response.context ? {
					type: response.context.type,
					url: response.context.external_urls.spotify
				} : null;
				const item = response.item;
				return {
					timestamp: response.timestamp,
					progress: response.progress_ms,
					isPlaying: response.is_playing,
					device,
					context,
					track: {
						id: item.id,
						name: item.name,
						popularity: item.popularity,
						duration: item.duration_ms,
						url: item.external_urls.spotify,
						uri: item.uri
					},
					artists: item.artists.map(artist => artist.name),
					album: {
						id: item.album.id,
						name: item.album.name,
						imageUrl: item.album.images[0].url,
						type: item.album.album_type
					}
				};
			}
			else 
				return null;
		}).catch(err => {
			console.log(access_token);
			console.log(spotifyId);
			console.log(err);
		});
		return currentPlayback;
	}

	async getRecentTracks(access_token, numRecent) {
		let options = {
			url: 'https://api.spotify.com/v1/me/player/recently-played?' + 
				querystring.stringify({limit: numRecent}),
			headers: {
				'Authorization': 'Bearer ' + access_token,
			},
			json: true
		};
		
		let recents = await request.get(options)
			.then(response => response.items.map(obj => {
				return {
					id: obj.track.id,
					title: obj.track.name,
					artist: obj.track.artists[0].name,
					album: obj.track.album.name,
					albumArt: obj.track.album.images[0].url,
					duration: obj.track.duration_ms,
					url: obj.track.external_urls.spotify
				};
			}))
			.catch(err => console.log(err));
		return recents;
	}

	async getTrackInfo(accessToken, trackId) {
		let options = {
			url: 'https://api.spotify.com/v1/tracks/' + trackId,
			headers: {
				'Authorization': 'Bearer ' + accessToken,
			},
			json: true
		};

		let item = await request.get(options);
		return {
			track: {
				id: item.id,
				name: item.name,
				popularity: item.popularity,
				duration: item.duration_ms,
				url: item.external_urls.spotify,
				uri: item.uri
			},
			artists: item.artists.map(artist => artist.name),
			album: {
				id: item.album.id,
				name: item.album,
				imageUrl: item.album.images[0].url,
				type: item.album.album_type
			}
		};
	}

	async putNewTrack(accessToken, spotifyUri) {
		const options = {
			url: 'https://api.spotify.com/v1/me/player/play',
			headers: {
				'Authorization': 'Bearer ' + accessToken,
				'Content-type': 'application/json'
			},
			body: {
				uris: [spotifyUri]	
			},
			json: true
		};

		return request.put(options).then(response => response.statusCode == 200);
	}
}

export default new Spotify();