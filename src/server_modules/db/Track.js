import db from '../db.js';
import TrackSchema from './schema/TrackSchema.js';

class Track  {
	constructor() {
		this.db = db.get();
	}

	addTrack(track) {
		return Promise.all([this.addTrackToSet(track.id), this.setTrackInfo(track)]);
	}

	addTrackToSet(trackId) {
		return this.db.sadd(TrackSchema.trackSetKey, trackId);
	}

	setTrackInfo(track) {
		return this.db.hmset(TrackSchema.trackKey(track.id), [
			TrackSchema.titleKey, track.title,
			TrackSchema.artistKey, track.artist,
			TrackSchema.albumKey, track.album,
			TrackSchema.artKey, track.albumArt,
			TrackSchema.durationKey, track.duration,
			TrackSchema.urlKey, track.url
		]);
	}

	hasTrack(trackId) {
		return this.db.sismember(TrackSchema.trackSetKey, trackId);
	}

	getTrack(trackId) {
		return this.db.hmget(TrackSchema.trackKey(trackId), [
			TrackSchema.titleKey,
			TrackSchema.artistKey,
			TrackSchema.albumKey,
			TrackSchema.artKey,
			TrackSchema.durationKey,
			TrackSchema.urlKey
		]).then(result => {
			if (!result[0]) {
				return null;
			}
				
			return {
				id: trackId,
				title: result[0],
				artist: result[1],
				album: result[2],
				albumArt: result[3],
				duration: result[4],
				url: result[5],
			};
		});
	}
}

export default Track;