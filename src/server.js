// imports ------------------------------------->
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; 
import express from 'express'; 
import morgan from 'morgan';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.js';
import Db from './server_modules/db.js';
import apiRoutes from './routes/api.js';
import loginRoutes from './routes/login.js';
// end imports --------------------------------->

Db.connect();
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