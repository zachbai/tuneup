const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require(path.resolve('./config.js'));
const db = require(path.resolve('./db.js'));
const spotify = require(path.resolve('./server_modules/spotify.js'));

const router = express.Router();

router.post('/auth', (req, res) => {
	const spotifyId = req.body.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'No spotify user ID supplied'
		});
	}

	db.hasUser(spotifyId).then((result) => {
		if (result) {
			const payload = {
				spotifyId: spotifyId
			};

			const token = jwt.sign(payload, config.appSecret, {
				expiresIn: '1440m' // expires in 24 hours
			});
			res.json({
				success: true,
				tuneup_token: token
			});
		} else {
			res.json({
				success: false,
				message: 'User does not exist'
			});
		}
	})
});

router.use(function(req, res, next) {
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

router.get('/me', (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	db.getUser(spotifyId).then(user => {
		res.json({
			success: true,
			payload: user 
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s profile'
		});
	});
})

// TODO: support query parameters for specific followers
router.get('/followers', (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	db.getFollowersForUser(spotifyId).then((followers) => {
		res.json({
			success: true,
			payload: followers 
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s followers'
		});
	});
});

// TODO: support query parameters for specific following
router.get('/following', (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	db.getFollowingForUser(spotifyId).then((following) => {
		res.json({
			success: true,
			payload: following 
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s following'
		});
	});
});

router.get('/recents', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const recents = await db.getRecentsForUser(spotifyId);
		let result = [];
		let accessToken = await db.getSpotifyAccessTokenForUser(spotifyId);

		let tracks = await Promise.all(recents.map(trackId => {
			return db.hasTrack(trackId).then(present => {
				if (present)
					return db.getTrack(trackId);
				else 
					return spotify.getTrackInfo(accessToken, trackId)
						.then(track => {
							return db.addTrack(track);
						});
			});
		}));

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

router.get('/current', async (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	try {
		const trackId = await db.getCurrentTrackForUser(spotifyId);
		let track = await db.getTrack(trackId);
		let accessToken = null;
		if (!track) {
			if (!accessToken)
				accessToken = await db.getSpotifyAccessTokenForUser(spotifyId);
			track = await spotify.getTrackInfo(accessToken, trackId);
		}

		res.json({
			success: true,
			currentTrack: track,
		});
	} catch(err) {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s current track'
		});
	};
});

module.exports = router;