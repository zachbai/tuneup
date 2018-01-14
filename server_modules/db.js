const Redis = require('ioredis');

const state = {
	db: null,
};

const connect = () => {
	state.db = new Redis({
		showFriendlyErrorStack: true
	});
};

const get = () => {
	return state.db;
};

module.exports = {
	// db methods
	connect,
	get,
};