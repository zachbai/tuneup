const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require(path.resolve('./config.js'));
const db = require(path.resolve('./db.js'));

const router = express.Router();

router.post('/auth', (req, res) => {
	const spotifyId = req.body.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'No spotify user ID supplied'
		});
	}

	db.getProfileForUser(spotifyId).then((profile) => {
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
	}).catch((err) => {
		res.json({
			success: false,
			message: 'Could not find user'
		});
	});
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

	db.getProfileForUser(spotifyId).then((profile) => {
		res.json({
			success: true,
			payload: profile
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s profile'
		});
	});
})

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

router.get('/recents', (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	db.getRecentsForUser(spotifyId).then((recents) => {
		res.json({
			success: true,
			payload: recents 
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s recents'
		});
	});
});

router.get('/current', (req, res) => {
	const spotifyId = req.decoded.spotifyId;
	if (!spotifyId) {
		res.json({
			success: false,
			message: 'Invalid token supplied'
		});
	}

	db.getCurrentTrackForUser(spotifyId).then((current) => {
		res.json({
			success: true,
			payload: current 
		});
	}).catch((err) => {
		console.log(err);
		res.json({
			success: false,
			message: 'Could not get user\'s current track'
		});
	});
});

module.exports = router;