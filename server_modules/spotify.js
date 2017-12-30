const request = require('request-promise-native');
const querystring = require('querystring');

const db = require('../db.js');

async function addUser(code, redirect_uri, client_id, client_secret) {
	let tokens = await getSpotifyAuthTokens(code, redirect_uri, client_id, client_secret);	
	let currentTrack = await getCurrentPlaying(tokens.accessToken);
	let userProfile = await getUserProfile(tokens.accessToken);
	let recents = await getTenRecentTracks(tokens.accessToken);

	let newUser = {
		username: userProfile.username,
		spotifyAccessToken: tokens.accessToken,
		spotifyRefreshToken: tokens.refreshToken,
		spotifyId: userProfile.spotifyId,
		imageUrl: userProfile.imageUrl,
		currentTrackId: currentTrack.id,
		followers: [],
		following: [],
		recents: recents,
	};

	return db.addUser(newUser).then(x => {
		console.log("Spotify ID:",userProfile.spotifyId);
		console.log("done!");
	})
	.catch(err => console.log(err));
}

async function getSpotifyAuthTokens(code, redirect_uri, client_id, client_secret) {
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri: redirect_uri,
			grant_type: 'authorization_code'
		},
		headers: {
			'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
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
		.then(response => response.item)
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
			}
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
