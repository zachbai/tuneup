const request = require('request-promise-native');
const querystring = require('querystring');

const db = require('../db.js');

async function addUser(code, redirectUri, clientId, clientSecret, facebookId) {
	let tokens = await getSpotifyAuthTokens(code, redirectUri, clientId, clientSecret);	
	let currentTrack = await getCurrentPlaying(tokens.accessToken);
	let userProfile = await getUserProfile(tokens.accessToken);
	let recents = await getTenRecentTracks(tokens.accessToken);

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
		recents: recents,
	};

	return db.addUser(newUser).then(x => {
		return userProfile.spotifyId;
	})
	.catch(err => console.log(err));
}

async function getSpotifyAuthTokens(code, redirectUri, clientId, clientSecret) {
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
		},
		json: true
	};	

	let tokens = await request.post(authOptions).then(res => {
		return {
			accessToken: res.access_token,
			refreshToken: res.refresh_token,
		};
	}).catch(err => console.log(err));

	return tokens;
}

async function getCurrentPlaying(access_token) {
	let options = {
		url: 'https://api.spotify.com/v1/me/player/currently-playing',
		headers: {
			'Authorization': 'Bearer ' + access_token,
		},
		json: true
	};

	let track = await request.get(options)
		.then(response => {
			if (response)
				return response.item;
			else 
				return null;
		})
		.catch(err => console.log(err));

	return track;
}

async function getUserProfile(access_token) {
	let options = {
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + access_token,
		},
		json: true
	};

	let profile = await request.get(options) 
		.then(response => {
			return {
				username: response.display_name,
				imageUrl: response.images.length > 0 ? response.images[0].url : null,
				spotifyId: response.id
			};
		})
		.catch(err => console.log(err));
	return profile;
}

async function getTenRecentTracks(access_token) {
	let options = {
		url: 'https://api.spotify.com/v1/me/player/recently-played?' + 
			querystring.stringify({limit: 10}),
		headers: {
			'Authorization': 'Bearer ' + access_token,
		},
		json: true
	};
	
	let recents = await request.get(options)
		.then(response => response.items)
		.catch(err => console.log(err));
	return recents;
}

async function getTrackInfo(accessToken, trackId) {
	let options = {
		url: 'https://api.spotify.com/v1/tracks/' + trackId,
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
		json: true
	};

	let fullTrack = await request.get(options)
		.then(response => response)

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

async function getTracksInfo(accessToken, trackIds) {
	let querystring = '';
	for (let i = 0; i < trackIds.length; i++)  {
		querystring += i < trackIds.length - 1 
			? trackIds[i] + ','
			: trackids[i];
	}

	let options = {
		url: 'https://api.spotify.com/v1/tracks/?ids=' + querystring,
		headers: {
			'Authorization': 'Bearer ' + accessToken,
		},
		json: true
	};

	let fullTracks = await request.get(options)
		.then(response => response)

	return fullTracks.map(fullTrack => {
		return {
			id: fullTrack.id,
			title: fullTrack.name,
			artist: fullTrack.artists[0].name,
			album: fullTrack.album.name,
			albumArt: fullTrack.album.images[0].url,
			duration: fullTrack.duration_ms,
			url: fullTrack.external_urls.spotify
		};
	});
}

exports.getTokens = getSpotifyAuthTokens;
exports.addUser = addUser;
exports.getTrackInfo = getTrackInfo;
