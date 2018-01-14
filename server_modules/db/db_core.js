const Redis = require('ioredis');

const state = {
	db: null,
};


const connect = () => {
	state.db = new Redis({
		showFriendlyErrorStack: true
	});
};

module.exports = {
	connect,
	get
};
