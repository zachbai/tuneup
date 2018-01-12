import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import TuneupReducer from './reducers/TuneupReducer';
import AppContainer from './containers/AppContainer.js';
import styles from './scss/application.scss';

const store = createStore(TuneupReducer);

render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('root')
);
