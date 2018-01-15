import Cookies from 'universal-cookie';
import constants from './constants.js';

const cookies = new Cookies();
module.exports = {
	cookies,
	getTuneupToken: () => {
		const token = localStorage.getItem(constants.TUNEUP_TOKEN_LOCAL_STORAGE_KEY);
		if (token) 
			return token;
		else 
			return null;
	},
	getSpotifyId: () => {
		const spotifyId = cookies.get(constants.SPOTIFY_COOKIES_KEY);
		if (spotifyId)
			return spotifyId;
		else 
			return null;
	}
};