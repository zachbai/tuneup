// imports ------------------------------------->
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const express = require('express'); 
const fetch = require('node-fetch');
const FormData = require('form-data');
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
// end imports --------------------------------->

const db = require('./db.js');
const config = require('./config.js');
const webpackConfig = require('./webpack.config.js');
const utils = require('./server_modules/utils.js');

// express routes
const apiRoutes = require('./routes/api.js');
const loginRoutes = require('./routes/login.js');

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

// hook up routes
app.use('/api', apiRoutes);
app.use('/login', loginRoutes);

app.get('/', (req, res) => {
	/*let fbLoggedIn = req.cookies ? req.cookies[fbUserKey] : null;
	let spotifyLoggedIn = req.cookies ? req.cookies[spotifyUserKey] : null;
	if (fbLoggedIn && spotifyLoggedIn) {
		res.send('logged in on both!');
		return;
	}*/
	res.sendFile(path.resolve('index.html'));
});

app.get('/success', (req, res) => {
	res.send('user added!');
});

app.listen(3000, () => console.log('Listening on port 3000...'));