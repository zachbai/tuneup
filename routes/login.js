const express = require('express');
const path = require('path');
const querystring = require('querystring');
const router = express.Router();

const config = require('../config.js');
const spotify = require(path.resolve('server_modules/spotify.js'));
const utils = require(path.resolve('server_modules/utils.js'));

// cookies keys
const stateKey = 'spotify_auth_state';
const spotifyUserKey = 'tuneup_spotify_user_id';
const facebookUserKey = 'tuneup_fb_user_id';

router.get('/spotify', (req, res) => {
	const state = utils.generateRandomString(16);	
	res.cookie(stateKey, state);

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			client_id: config.spotifyClientId,
			response_type: 'code',
			redirect_uri: config.spotifyRedirectUri,
			state: state,
			scope: config.spotifyScope, 
			show_dialog: true // for testing purposes
		}));
});

router.get('/spotify-callback', async (req, res) => {
	const code = req.query.code || null;	
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;
	const storedFacebookId = req.cookies ? req.cookies[facebookUserKey] : null;

	if (!state || state != storedState) {
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);

		let spotifyId = await spotify.addUser(code, 
			config.spotifyRedirectUri, 
			config.spotifyClientId, 
			config.spotifyClientSecret, 
			storedFacebookId);

		res.cookie(spotifyUserKey, spotifyId);
		res.sendFile(path.resolve('login_success.html'));
	}
});

module.exports = router;