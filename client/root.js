import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import api from './core/api';
import socket from './core/socket';
import App from './containers/App.js';
import store from './store';
import styles from './scss/main.scss';


socket.listen();
api.initializeState();

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
