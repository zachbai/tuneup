import db from '../db';
import * as schema from './schema/UserPlaybackSchema';

class UserPlayback {
	async getUserPlayback(userId) {
		const result = await Promise.all([
			this.__getCurrentPlayback(userId),
			this.__getCurrentDevice(userId),
			this.__getCurrentContext(userId),
			this.__getCurrentTrack(userId),
			this.__getCurrentArtists(userId),
			this.__getCurrentAlbum(userId)
		]);
		return {
			timestamp: result[0].timestamp,
			progress: result[0].progress,
			isPlaying: result[0].isPlaying,
			device: result[1],
			context: result[2],
			track: result[3],
			artists: result[4],
			album: result[5]
		};
	}

	setUserPlayback(userId, currentPlayback) {
		return Promise.all([
			this.__setCurrentPlayback(userId, currentPlayback),
			this.__setCurrentDevice(userId, currentPlayback.device),
			this.__setCurrentContext(userId, currentPlayback.context),
			this.__setCurrentTrack(userId, currentPlayback.track),
			this.__setCurrentArtists(userId, currentPlayback.artists),
			this.__setCurrentAlbum(userId, currentPlayback.album)
		]);
	}

	__getCurrentPlayback(userId) {
		return db.get().hmget(schema.currentPlaybackKey(userId), [
			schema.currentPlaybackTimestampKey,
			schema.currentPlaybackProgressKey,
			schema.currentPlaybackIsPlayingKey
		]).then(result => {
			return {
				timestamp: result[0],
				progress: result[1],
				isPlaying: result[2]
			};
		});
	}

	__setCurrentPlayback(userId, currentPlayback) {
		return db.get().hmset(schema.currentPlaybackKey(userId), [
			schema.currentPlaybackTimestampKey, currentPlayback.timestamp,
			schema.currentPlaybackProgressKey, currentPlayback.progress,
			schema.currentPlaybackIsPlayingKey, currentPlayback.isPlaying
		]);
	}

	__getCurrentDevice(userId) {
		return db.get().hmget(schema.currentPlaybackDeviceKey(userId), [
			schema.deviceNameKey,
			schema.deviceIsActiveKey,
			schema.deviceIsRestrictedKey,
			schema.deviceTypeKey,
			schema.deviceVolumePercentKey
		]).then(result => {
			return {
				name: result[0],
				isActive: result[1],
				isRestricted: result[2],
				type: result[3],
				volumePercent: result[4]
			};
		});
	}

	__setCurrentDevice(userId, currentDevice) {
		return db.get().hmset(schema.currentPlaybackDeviceKey(userId), [
			schema.deviceNameKey, currentDevice.name,
			schema.deviceIsActiveKey, currentDevice.isActive,
			schema.deviceIsRestrictedKey, currentDevice.isRestricted,
			schema.deviceTypeKey, currentDevice.type,
			schema.deviceVolumePercentKey, currentDevice.volumePercent
		]);
	}

	__getCurrentContext(userId) {
		return db.get().hmget(schema.currentPlaybackContextKey(userId), [
			schema.currentPlaybackContextTypeKey,
			schema.currentPlaybackContextUrlKey
		]).then(result => {
			if (!result)
				return null;
			return {
				type: result[0],
				url: result[1]
			};
		});

	}

	__setCurrentContext(userId, currentContext) {
		if (!currentContext) {
			return db.get().del(schema.currentPlaybackContextKey);
		}
		return db.get().hmset(schema.currentPlaybackContextKey(userId), [
			schema.currentPlaybackContextTypeKey, currentContext.type,
			schema.currentPlaybackContextUrlKey, currentContext.url
		]);
	}

	__getCurrentTrack(userId) {
		return db.get().hmget(schema.currentPlaybackTrackKey(userId), [
			schema.trackIdKey,
			schema.trackNameKey,
			schema.trackPopularityKey,
			schema.trackDurationKey,
			schema.trackUrlKey
		]).then(result => {
			return {
				id: result[0],
				name: result[1],
				popularity: result[2],
				duration: result[3],
				url: result[4]	
			};
		});
	}

	__setCurrentTrack(userId, currentTrack) {
		return db.get().hmset(schema.currentPlaybackTrackKey(userId), [
			schema.trackIdKey, currentTrack.id,
			schema.trackNameKey, currentTrack.name,
			schema.trackPopularityKey, currentTrack.popularity,
			schema.trackDurationKey, currentTrack.duration,
			schema.trackUrlKey, currentTrack.url
		]);
	}

	__getCurrentArtists(userId) {
		return db.get().lrange(schema.currentPlaybackArtistsKey(userId), 0, -1);
	}

	async __setCurrentArtists(userId, artists) {
		await db.get().del(schema.currentPlaybackArtistsKey(userId));
		return Promise.all(artists.map(artist => {
			return db.get().lpush(schema.currentPlaybackArtistsKey(userId), artist);
		}));
	}

	__getCurrentAlbum(userId) {
		return db.get().hmget(schema.currentPlaybackAlbumKey(userId), [
			schema.albumIdKey,
			schema.albumNameKey,
			schema.albumImageUrlKey,
			schema.albumTypeKey,
		]).then(result => {
			return {
				id: result[0],
				name: result[1],
				imageUrl: result[2],
				type: result[3]
			};
		});
	}

	__setCurrentAlbum(userId, album) {
		return db.get().hmset(schema.currentPlaybackAlbumKey(userId), [
			schema.albumIdKey, album.id,
			schema.albumNameKey, album.name,
			schema.albumImageUrlKey, album.imageUrl,
			schema.albumTypeKey, album.type
		]);
	}
}

export default new UserPlayback();