// imports ------------------------------------->
const cookieParser = require('cookie-parser'); 
const express = require('express'); 
const fetch = require('node-fetch');
const FormData = require('form-data');
const morgan = require('morgan');
const path = require('path');
const querystring = require('querystring');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config.js');
const utils = require('./server_modules/utils.js');
// end imports --------------------------------->

// TODO refactor below into env variables
const CLIENT_ID = 'abdfa398cf6b4b54b669bd3282bdce22';
const CLIENT_SECRET = 'a9491051e13d413f8afd5bfa8c6ee515';
const REDIRECT_URI = 'http://lvh.me:3000/callback-spotify';

const app = express();
const stateKey = 'spotify_auth_state';
const compiler = webpack(webpackConfig);

// middleware
app.use(cookieParser());
app.use(morgan('tiny'));
app.use(express.static('/dist'));
app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath
}));

app.get('/', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

app.get('/login-spotify', (req, res) => {
	let state = utils.generateRandomString(16);	
	res.cookie(stateKey, state);

	let scope = 'playlist-modify-public playlist-modify-private streaming user-follow-modify ' +
		'user-read-email user-top-read user-modify-playback-state user-read-recently-played';

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

app.get('/callback-spotify', (req, res) => {
	let code = req.query.code || null;	
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;

	if (!state || state != storedState) {
		console.error('state', state);
		console.error('storedState', storedState);
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);
		let authString = 'Basic ' + new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');
		let authOptions = {
			method: 'POST',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'Authorization': authString
			},
			body: querystring.stringify({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: REDIRECT_URI
			}),
		};

		console.log("Obtaining access token...");
		fetch('https://accounts.spotify.com/api/token', authOptions)
			.then((response) => {
				console.log(response.status);
				return response.text();
			}).then((body) => {
				console.log(body);
				return;
			});

		res.redirect('/success');
	}
});

app.get('/success', (req, res) => {
	res.send('success!');
});

app.listen(3000, () => console.log('Listening on port 3000...'));
