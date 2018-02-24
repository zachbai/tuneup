import constants from './constants.js';
import shared from './shared.js';

module.exports = {
	getToken: () => {
		let spotifyId = shared.cookies.get(constants.SPOTIFY_COOKIES_KEY);
		shared.cookies.remove(constants.SPOTIFY_COOKIES_KEY);
		localStorage.setItem(constants.SPOTIFY_LOCAL_STORAGE_KEY, spotifyId);
		let tokenOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				spotifyId: spotifyId
			}),
		};

		return new Promise((resolve, reject) => {
			fetch('/api/auth', tokenOptions).then((response) => {
				return response.json();
			}).then((body) => {
				if (body.success) {
					localStorage.setItem(constants.TUNEUP_TOKEN_LOCAL_STORAGE_KEY, body.tuneup_token);
					resolve(true);
				} else {
					resolve(false);
				}
			}).catch((err) => {
				console.error(err);
				reject(err);
			});
		});
	},
	logOut: () => {
		localStorage.clear();
	}
};