import express from 'express';
import path from 'path';
import querystring from 'querystring';
import config from '../config.js';
import tuneup from '../server_modules/tuneup';
import utils from '../server_modules/utils.js';


const  Router = express.Router();

// cookies keys
const stateKey = 'spotify_auth_state';

Router.get('/spotify', (req, res) => {
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

Router.get('/spotify-callback', async (req, res) => {
	const code = req.query.code || null;	
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (!state || state != storedState) {
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);
		try {
			const spotifyId = await tuneup.addUser(code);
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

export default Router;