/* 
* Track schema
* Track: Hash by spotify track id
* - track title
* - artist 
* - album
* - year
* - duration
* - album art image url 
*/

const TRACK_KEY = 't';
const TITLE_KEY = 'tt';
const ARTIST_KEY = 'ar';
const ALBUM_KEY = 'al';
const DURATION_KEY = 'd';
const ART_KEY = 'at';
const URI_KEY = 'ur';

exports.trackKey = (id) => {
	return TRACK_KEY + ':' + id;
};

exports.trackSetKey = TRACK_KEY;
exports.titleKey = TITLE_KEY;
exports.artistKey = ARTIST_KEY;
exports.albumKey = ALBUM_KEY;
exports.durationKey = DURATION_KEY;
exports.artKey = ART_KEY;
exports.uriKey = URI_KEY;
