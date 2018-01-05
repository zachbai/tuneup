const express = require('express');
const path = require('path');
const querystring = require('querystring');
const router = express.Router();

const config = require('../config.js');
const spotify = require(path.resolve('server_modules/spotify.js'));
const utils = require(path.resolve('server_modules/utils.js'));

// cookies keys
const stateKey = 'spotify_auth_state';
const spotifyUserKey = 'spotify_user_id';
const fbUserKey = 'fb_user_id'

router.get('/spotify', (req, res) => {
	let state = utils.generateRandomString(16);	
	res.cookie(stateKey, state);

	let scope = 'user-read-private playlist-read-private playlist-modify-private ' +
		'playlist-modify-public playlist-read-collaborative user-top-read ' +
		'user-read-recently-played user-library-read user-library-modify ' +
		'user-read-currently-playing user-modify-playback-state user-read-playback-state streaming';

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			client_id: config.spotifyClientId,
			response_type: 'code',
			redirect_uri: config.spotifyRedirectUri,
			state: state,
			scope: scope, 
			show_dialog: true // for testing purposes
		}));
});

router.get('/spotify-callback', async (req, res) => {
	let code = req.query.code || null;	
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;
	let storedFbId = req.cookies ? req.cookies[fbUserKey] : null;

	if (!state || state != storedState || !storedFbId) {
		console.log('state:', state);
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);

        let spotifyId = await spotify.addUser(code, 
            config.spotifyRedirectUri, 
            config.spotifyClientId, 
            config.spotifyClientSecret, 
            storedFbId);

		res.cookie(spotifyUserKey, spotifyId);
		res.sendFile(path.resolve('login_success.html'));
	}
});

module.exports = router;