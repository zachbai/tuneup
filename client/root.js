import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import App from './containers/App.js';
import store from './store';
import styles from './scss/main.scss';

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);
