import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import tuneup from '../server_modules/tuneup.js';

const Router = express.Router();

Router.post('/auth', async (req, res) => {
	const spotifyId = req.body.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'No spotify user ID supplied'
		});
		return;
	}

	try {
		const hasUser = await tuneup.hasUser(spotifyId);
		if (hasUser) {
			const payload = {
				spotifyId: spotifyId
			};
			const expiry = 60 * 60 * 24;
			const tokenOptions = {
				expiresIn: expiry // expires in 24 hours
			};

			const token = jwt.sign(payload, config.appSecret, tokenOptions);
			res.clearCookie(config.spotifyIdCookieKey);
			res.json({
				success: true,
				tuneup_token: token,
				expiry: Date.now() + (expiry - 1) * 1000 
			});
		} else 
			throw 'User does not exist';
	} catch(err) {
		res.json({
			success: false,
			message: 'User does not exist'
		});
	}
});

Router.use((req, res, next) => {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		// verify token
		jwt.verify(token, config.appSecret, function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				req.decoded = decoded;    
				next();
			}
		});
	} else {
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});
	}
});

Router.get('/me', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const user = await tuneup.getUser(spotifyId);
		res.json({
			success: true,
			payload: user 
		});

	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s profile'
		});
	}
});

// TODO: support query parameters for specific followers
Router.get('/followers', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const followers = await tuneup.getFollowers(spotifyId);
		res.json({
			success: true,
			payload: followers 
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s followers'
		});
	}
});

// TODO: support query parameters for specific following
Router.get('/following', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const following = await tuneup.getFollowing(spotifyId);
		res.json({
			success: true,
			payload: following 
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s following'
		});
	}
});

Router.get('/current', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const currentPlayback = await tuneup.getCurrentPlayback(spotifyId);
		res.json({
			success: true,
			currentPlayback: currentPlayback,
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s current track'
		});
	}
});

Router.put('/play', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const success = await tuneup.putNewTrack(spotifyId, req.body.uri);
		if (success) {
			res.json({
				success: true,
			});
		} else 
			throw 'Could not set new track to play';
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not set new track to play'
		});
	}
});

export default Router;