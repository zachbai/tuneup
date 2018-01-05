// imports ------------------------------------->
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const express = require('express'); 
const fetch = require('node-fetch');
const FormData = require('form-data');
const morgan = require('morgan');
const path = require('path');
const querystring = require('querystring');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const db = require('./db.js');
const spotify = require('./server_modules/spotify.js');
const webpackConfig = require('./webpack.config.js');
const utils = require('./server_modules/utils.js');
// end imports --------------------------------->

// TODO refactor below into env variables
const CLIENT_ID = 'abdfa398cf6b4b54b669bd3282bdce22';
const CLIENT_SECRET = 'a9491051e13d413f8afd5bfa8c6ee515';
const REDIRECT_URI = 'http://lvh.me:3000/callback-spotify';

const app = express();
const compiler = webpack(webpackConfig); db.connect();

// cookies keys
const stateKey = 'spotify_auth_state';
const spotifyUserKey = 'spotify_user_id';
const fbUserKey = 'fb_user_id'

// middleware
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.static('/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath
}));

app.get('/', (req, res) => {
	let fbLoggedIn = req.cookies ? req.cookies[fbUserKey] : null;
	let spotifyLoggedIn = req.cookies ? req.cookies[spotifyUserKey] : null;
	if (fbLoggedIn && spotifyLoggedIn) {
		res.send('logged in on both!');
		return;
	}
	res.sendFile(path.resolve('index.html'));
});

app.get('/login-spotify', (req, res) => {
	let fbId = req.query.fbId;
	if (!fbId)
		res.redirect('/login');

	let state = utils.generateRandomString(16);	
	res.cookie(stateKey, state);
	res.cookie(fbUserKey, fbId);

	let scope = 'user-read-private playlist-read-private playlist-modify-private ' +
		'playlist-modify-public playlist-read-collaborative user-top-read ' +
		'user-read-recently-played user-library-read user-library-modify ' +
		'user-read-currently-playing user-modify-playback-state user-read-playback-state streaming';

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			client_id: CLIENT_ID,
			response_type: 'code',
			redirect_uri: REDIRECT_URI,
			state: state,
			scope: scope, 
			show_dialog: true // for testing purposes
		}));
});

app.get('/callback-spotify', async (req, res) => {
	let code = req.query.code || null;	
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;
	let storedFbId = req.cookies ? req.cookies[fbUserKey] : null;

	if (!state || state != storedState || !storedFbId) {
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);

		let spotifyId = await spotify.addUser(code, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET, storedFbId);

		res.cookie(spotifyUserKey, spotifyId);
		res.redirect('/');
	}
});

app.get('/fb-auth-error', (req, res) => {
	res.send('Facebook authentication error');
});

app.get('/check-login', (req, res) => {
	let fbLoggedIn = req.cookies ? req.cookies[fbUserKey] : null;
	let spotifyLoggedIn = req.cookies ? req.cookies[spotifyUserKey] : null;
	console.log('fbLoggedIn', fbLoggedIn);
	console.log('spotifyLoggedIn', spotifyLoggedIn);

	res.send({
		fbLoggedIn: fbLoggedIn,
		spotifyLoggedIn: spotifyLoggedIn
	});
});

app.get('/success', (req, res) => {
	res.send('user added!');
});

app.listen(3000, () => console.log('Listening on port 3000...'));
