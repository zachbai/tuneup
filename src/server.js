// imports ------------------------------------->
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'; 
import express from 'express'; 
import morgan from 'morgan';
import path from 'path';
import { Server } from 'http';
import socketio from 'socket.io';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.js';

import db from './server_modules/db.js';
import Tuneup from './server_modules/tuneup';
import apiRoutes from './routes/api.js';
import loginRoutes from './routes/login.js';
// end imports --------------------------------->

db.connect();
const app = express();
const server = new Server(app);
const io = socketio(server);
const compiler = webpack(webpackConfig); 

io.on('connect', () => {
	console.log('A client has connected');
});
Tuneup.setSocket(io);

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

server.listen(3000, () => console.log('Listening on port 3000...'));