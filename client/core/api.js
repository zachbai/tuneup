import shared from './shared';

const api = {
	getMe() {
		const options = {
			headers: {
				'x-access-token': shared.getTuneupToken()
			}
		};
		return fetch('/api/me', options).then(res => res.json())
			.then((res) => {
				return {
					username: res.payload.username,
					imageUrl: res.payload.imageUrl
				};
			}).catch(err => console.err(err));
	},

	getCurrentPlayback() {
		const options = {
			headers: {
				'x-access-token': shared.getTuneupToken()
			}
		};
		return fetch('/api/current', options).then(res => res.json())
			.then((res) => {
				return res.currentPlayback;
			}).catch(err => console.err(err));
	}
};

export default api;