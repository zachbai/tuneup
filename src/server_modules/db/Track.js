import db from '../db.js';
import TrackSchema from './schema/TrackSchema.js';

class Track  {
	addTrack(track) {
		return Promise.all([this.addTrackToSet(track.id), this.setTrackInfo(track)]);
	}

	addTrackToSet(trackId) {
		return db.get().sadd(TrackSchema.trackSetKey, trackId);
	}

	setTrackInfo(track) {
		return db.get().hmset(TrackSchema.trackKey(track.id), [
			TrackSchema.titleKey, track.title,
			TrackSchema.artistKey, track.artist,
			TrackSchema.albumKey, track.album,
			TrackSchema.artKey, track.albumArt,
			TrackSchema.durationKey, track.duration,
			TrackSchema.urlKey, track.url
		]);
	}

	hasTrack(trackId) {
		return db.get().sismember(TrackSchema.trackSetKey, trackId);
	}

	getTrack(trackId) {
		return db.get().hmget(TrackSchema.trackKey(trackId), [
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

export default new Track();