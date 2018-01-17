module.exports = {
	facebookIdCookieKey: 'tuneup_fb_user_id',
	spotifyIdCookieKey: 'tuneup_spotify_user_id',
	spotifyClientId: 'abdfa398cf6b4b54b669bd3282bdce22',
	spotifyClientSecret: 'a9491051e13d413f8afd5bfa8c6ee515',
	// spotifyRedirectUri: 'http://lvh.me:3000/login/spotify-callback',
	spotifyRedirectUri: 'http://0b5f0539.ngrok.io/login/spotify-callback',
	spotifyScope: 'user-read-private playlist-read-private playlist-modify-private ' +
		'playlist-modify-public playlist-read-collaborative user-top-read ' +
		'user-read-recently-played user-library-read user-library-modify ' +
		'user-read-currently-playing user-modify-playback-state user-read-playback-state streaming',
	appSecret: 'tuneupbyzb2017'
};