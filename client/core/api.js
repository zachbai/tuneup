import shared from './shared';
import constants from './constants';
import store from '../store';
import socket from './socket';
import { setUserInfo, updateCurrentPlayback, setFollowers, setFollowing } from '../actions/UserActions';

const api = {
	async initializeState() {
		await this.getValidAuthToken();
		socket.listen();
		this.getMe().then(userInfo => {
			store.dispatch(setUserInfo(userInfo));
		}).catch(err => console.error(err));

		this.getCurrentPlayback().then(currentPlayback => {
			if (currentPlayback)
				store.dispatch(updateCurrentPlayback(currentPlayback, shared.getSpotifyId()));
		}).catch(err => console.error(err));

		this.getFollowers().then(followers => {
			store.dispatch(setFollowers(followers));
		});

		this.getFollowing().then(following => {
			store.dispatch(setFollowing(following));
		});
	},

	getValidAuthToken() {
		if (Date.now() < localStorage.getItem(constants.TUNEUP_TOKEN_EXPIRY_LOCAL_STORAGE_KEY))
			return localStorage.getItem(constants.TUNEUP_TOKEN_LOCAL_STORAGE_KEY);

		let spotifyId = shared.getSpotifyId();
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
					localStorage.setItem(constants.TUNEUP_TOKEN_EXPIRY_LOCAL_STORAGE_KEY, body.expiry);
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

	async getMe() {
		const validToken = await this.getValidAuthToken();
		const options = {
			headers: {
				'x-access-token': validToken
			}
		};
		return fetch('/api/me', options).then(res => res.json())
			.then((res) => res.payload)
			.catch(err => console.error(err));
	},

	async getCurrentPlayback() {
		const validToken = await this.getValidAuthToken();
		const options = {
			headers: {
				'x-access-token': validToken
			}
		};
		return fetch('/api/current', options).then(res => res.json())
			.then((res) => {
				return res.currentPlayback;
			}).catch(err => console.error(err));
	},

	async getFollowers() {
		const validToken = await this.getValidAuthToken();
		const options = {
			headers: {
				'x-access-token': validToken
			}
		};

		return fetch('/api/followers', options).then(res => res.json())
			.then((res) => {
				return res.payload;
			}).catch(err => console.error(err));
	},

	getFollowing() {
		const options = {
			headers: {
				'x-access-token': shared.getTuneupToken()
			}
		};

		return fetch('/api/following', options).then(res => res.json())
			.then((res) => {
				return res.payload;
			}).catch(err => console.error(err));
	}
};

export default api;