// imports ------------------------------------->
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const express = require('express'); 
const morgan = require('morgan');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const db = require('./server_modules/db.js');
const apiRoutes = require('./routes/api.js');
const loginRoutes = require('./routes/login.js');
// end imports --------------------------------->

db.connect();
const app = express();
const compiler = webpack(webpackConfig); 

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
	res.sendFile(path.resolve('index.html'));
});

app.get('/success', (req, res) => {
	res.send('user added!');
});

app.listen(3000, () => console.log('Listening on port 3000...'));