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
const stateKey = 'spotify_auth_state';
const userIdKey = 'facebook_user_id';
const compiler = webpack(webpackConfig);
db.connect();

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
	res.send('logged in');
})

app.get('/login', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

app.post('/login', (req, res) => {
	let userId = req.body.userId;
	res.cookie(userIdKey, userId);

	let response = {
		success: true, 
	};
	res.send(JSON.stringify(response));
});

app.get('/login-spotify', (req, res) => {
	let state = utils.generateRandomString(16);	
	res.cookie(stateKey, state);

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

app.get('/callback-spotify', (req, res) => {
	let code = req.query.code || null;	
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;
	let storedUserId = req.cookies ? req.cookies[userIdKey] : null;

	if (!state || state != storedState) {
		res.redirect('/auth_error');
	} else {
		res.clearCookie(stateKey);
		console.log("Obtaining access token...");
		spotify.addUser(code, REDIRECT_URI, CLIENT_ID, CLIENT_SECRET).then(tokens => {
			console.log("done");
			// lets do something with these tokens eh
		});
		res.redirect('/success');
	}
});

app.get('/success', (req, res) => {
	res.send('success!');
});

app.listen(3000, () => console.log('Listening on port 3000...'));
