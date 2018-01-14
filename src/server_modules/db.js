import Redis from 'ioredis';

class Db {
	constructor() {
		this.db = null;
	}

	connect() {
		this.db = new Redis({
			showFriendlyErrorStack: true
		});
	}

	get() {
		return this.db;
	}
}

export default new Db();