const request = require('request-promise-native');
const querystring = require('querystring');

const db = require('../db.js');

async function addUser(code, redirectUri, clientId, clientSecret, fbId) {
	let tokens = await getSpotifyAuthTokens(code, redirectUri, clientId, clientSecret);	
	let currentTrack = await getCurrentPlaying(tokens.accessToken);
	let userProfile = await getUserProfile(tokens.accessToken);
	let recents = await getTenRecentTracks(tokens.accessToken);

	let newUser = {
		username: userProfile.username,
		spotifyAccessToken: tokens.accessToken,
		spotifyRefreshToken: tokens.refreshToken,
		spotifyId: userProfile.spotifyId,
		fbId: fbId,
		imageUrl: userProfile.imageUrl,
		currentTrackId: currentTrack ? currentTrack.id : null,
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

exports.getTokens = getSpotifyAuthTokens;
exports.addUser = addUser;
