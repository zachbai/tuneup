import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import TuneupReducer from './reducers/TuneupReducer';
import AppContainer from './containers/AppContainer.js';
import styles from './scss/main.scss';

const loggerMiddleware = createLogger();

const store = createStore(
    TuneupReducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
);

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
);
