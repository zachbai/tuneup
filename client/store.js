import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import TuneupReducer from './reducers/TuneupReducer';
import { createLogger } from 'redux-logger';
const loggerMiddleware = createLogger();

const store = createStore(
	TuneupReducer,
	applyMiddleware(thunkMiddleware, loggerMiddleware)
);

export default store;