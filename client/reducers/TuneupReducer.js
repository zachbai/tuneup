import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import UserReducer from './UserReducer';

const TuneupReducer = combineReducers({
	userState: UserReducer,
	authState: combineReducers(AuthReducer)
});

export default TuneupReducer;
