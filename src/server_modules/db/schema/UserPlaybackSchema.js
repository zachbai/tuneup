import { userKey } from './UserSchema';

// hash of current playback attributes
export const currentPlaybackKey = id => userKey(id) + ':' + 'cp';
export const currentPlaybackProgressKey = 'p';
export const currentPlaybackIsPlayingKey = 'ip';
export const currentPlaybackTimestampKey = 'ts';

// hash of track attributes
export const currentPlaybackTrackKey = id => currentPlaybackKey(id) + ':'  + 't';
export const trackIdKey = 'id';
export const trackNameKey = 'n';
export const trackPopularityKey = 'p';
export const trackDurationKey = 'd';
export const trackUrlKey = 'u';

// hash of album attributes
export const currentPlaybackAlbumKey = id => currentPlaybackKey(id) + ':' + 'al';
export const albumIdKey = 'id';
export const albumNameKey = 'n';
export const albumImageUrlKey = 'iu';
export const albumTypeKey = 't';

// list of artist names
export const currentPlaybackArtistsKey = id => currentPlaybackKey(id) + ':' + 'ar';

export const currentPlaybackDeviceKey = id => currentPlaybackKey(id) + ':'  + 'd'; // hash of device attributes
export const deviceIsActiveKey = 'ia';
export const deviceIsRestrictedKey = 'ir';
export const deviceNameKey = 'n';
export const deviceTypeKey = 't';
export const deviceVolumePercentKey = 'vp';

export const currentPlaybackContextKey = id => currentPlaybackKey(id) + ':'  + 'c';
export const currentPlaybackContextTypeKey= 't';
export const currentPlaybackContextUrlKey = 'u';
