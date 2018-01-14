const express = require('express');
const path = require('path');
const querystring = require('querystring');
const router = express.Router();

const config = require('../config.js');
const tuneup = require('../server_modules/tuneup');
const utils = require('../server_modules/utils.js');

// cookies keys
const stateKey = 'spotify_auth_state';

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
	const storedFacebookId = req.cookies ? req.cookies[config.facebookIdCookieKey] : null;

	if (!state || state != storedState) {
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);
		res.clearCookie(config.facebookIdCookieKey);
		try {
			const spotifyId = await tuneup.addUser(code, storedFacebookId);
			if (!spotifyId)
				throw 'User could not be added';
			res.cookie(config.spotifyIdCookieKey, spotifyId);
			res.sendFile(path.resolve('login_success.html'));

		} catch(err) {
			console.error(err);
			res.redirect('/auth_error');
		}
	}
});

module.exports = router;