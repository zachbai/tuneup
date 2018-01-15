import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import api from './core/api';
import socket from './core/socket';
import shared from './core/shared';
import App from './containers/App.js';
import styles from './scss/main.scss';
import store from './store';
import { setUserInfo, updateCurrentPlayback } from './actions/UserActions';


socket.listen();
api.getMe().then(userInfo => {
	store.dispatch(setUserInfo(userInfo));
}).catch(err => console.error(err));

api.getCurrentPlayback().then(currentPlayback => {
	store.dispatch(updateCurrentPlayback(currentPlayback, shared.getSpotifyId()));
}).catch(err => console.error(err));

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
