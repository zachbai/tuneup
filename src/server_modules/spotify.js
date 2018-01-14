import request from 'request-promise-native';
import querystring from 'querystring';
import config from '../config.js';

class Spotify {
	async newUser(code, facebookId) {
		const tokens = await this.getTokens(code);	
		const userInfo = await Promise.all([
			this.getUserProfile(tokens.accessToken),
			this.getCurrentTrack(tokens.accessToken),
			this.getRecentTracks(tokens.accessToken, 25)
		]);
		const userProfile = userInfo[0];
		const currentTrack = userInfo[1];
		const recentsTrackIds = userInfo[2].map((track) => track.id);

		let newUser = {
			username: userProfile.username,
			spotifyAccessToken: tokens.accessToken,
			spotifyRefreshToken: tokens.refreshToken,
			spotifyId: userProfile.spotifyId,
			facebookId: facebookId,
			imageUrl: userProfile.imageUrl,
			currentTrackId: currentTrack ? currentTrack.id : null,
			lastUpdated: Date.now(),
			followers: [],
			following: [],
			recents: recentsTrackIds,
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
			};
		}).catch(err => console.log(err));

		return tokens;
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

	async getCurrentTrack(access_token) {
		let options = {
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			headers: {
				'Authorization': 'Bearer ' + access_token,
			},
			json: true
		};

		let track = await request.get(options).then(response => {
			if (response) {
				const fullTrack = response.item;
				return {
					id: fullTrack.id,
					title: fullTrack.name,
					artist: fullTrack.artists[0].name,
					album: fullTrack.album.name,
					albumArt: fullTrack.album.images[0].url,
					duration: fullTrack.duration_ms,
					url: fullTrack.external_urls.spotify
				};
			}
			else 
				return null;
		}).catch(err => console.log(err));
		return track;
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

		let fullTrack = await request.get(options);
		return {
			id: fullTrack.id,
			title: fullTrack.name,
			artist: fullTrack.artists[0].name,
			album: fullTrack.album.name,
			albumArt: fullTrack.album.images[0].url,
			duration: fullTrack.duration_ms,
			url: fullTrack.external_urls.spotify
		};
	}
}

export default new Spotify();