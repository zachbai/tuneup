const express = require('express');
const jwt = require('jsonwebtoken');

const config = require('../config.js');
const tuneup = require('../server_modules/tuneup.js');

const router = express.Router();

router.post('/auth', async (req, res) => {
	const spotifyId = req.body.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'No spotify user ID supplied'
		});
	}

	try {
		const hasUser = await tuneup.hasUser(spotifyId);
		if (hasUser) {
			const payload = {
				spotifyId: spotifyId
			};
			const tokenOptions = {
				expiresIn: '1440m' // expires in 24 hours
			};

			const token = jwt.sign(payload, config.appSecret, tokenOptions);
			res.clearCookie(config.spotifyIdCookieKey);
			res.json({
				success: true,
				tuneup_token: token
			});
		} else 
			throw 'User doesdb not exist';
	} catch(err) {
		res.json({
			success: false,
			message: 'User does not exist'
		});
	}
});

router.use((req, res, next) => {
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

router.get('/me', async (req, res) => {
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
router.get('/followers', async (req, res) => {
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
router.get('/following', async (req, res) => {
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

router.get('/recents', async (req,res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const tracks = await tuneup.getRecents(spotifyId);
		res.json({
			success: true,
			recents: tracks 
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s recents'
		});
	}
});

router.get('/tracks', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}
	const trackIds = req.query.ids.split(',');	

	try {
		const tracks = await tuneup.getTracks(spotifyId, trackIds);
		res.json({
			success: true,
			tracks: tracks
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s recents'
		});
	}
});

router.get('/current', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const currentTrack = await tuneup.getCurrentTrack(spotifyId);
		res.json({
			success: true,
			currentTrack: currentTrack,
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s current track'
		});
	}
});

module.exports = router;