import TuneupActionTypes from './TuneupActionTypes';
import shared from '../core/shared';

export const requestAddFollower = followerId => {
	return {
		type: TuneupActionTypes.REQUEST_ADD_FOLLOWER,
		followerId
	};
};

export const doneAddFollower = (followerId, follower) => {
	return {
		type: TuneupActionTypes.DONE_ADD_FOLLOWER,
		followerId,
		follower
	};
};

export const addFollower = followerId => {
	return dispatch => {
		dispatch(requestAddFollower(followerId));

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-access-token': shared.getTuneupToken,
			},
			body: JSON.stringify({
				add: true,
				followerId: followerId
			}),
		};

		return fetch('/followers', options).then(response => response.json())
			.then(body => {
				if (!body.success)
					throw 'Could not add follower';
				else {
					const follower = body.follower;
					return dispatch(doneAddFollower(followerId, follower));
				}
			}).catch(err => {
				console.error(err);
				return dispatch(apiError(TuneupActionTypes.ADD_FOLLOWER));
			});
	};
};

export const requestRemoveFollower = followerId => {
	return {
		type: TuneupActionTypes.REQUEST_REMOVE_FOLLOWER,
		followerId
	};
};

export const doneRemoveFollower = followerId => {
	return {
		type: TuneupActionTypes.DONE_REMOVE_FOLLOWER,
		followerId
	};
};

export const removeFollower = followerId => {
	return dispatch => {
		dispatch(requestRemoveFollower(followerId));

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-access-token': shared.getTuneupToken,
			},
			body: JSON.stringify({
				add: false,
				followerId: followerId
			}),
		};

		fetch('/followers', options).then(response => response.json())
			.then(body => {
				if (!body.success)
					throw 'Could not remove follower'; 
				else 
					return dispatch(doneRemoveFollower(followerId));
			}).catch(err => {
				console.error(err);
				return dispatch(apiError(TuneupActionTypes.REMOVE_FOLLOWER));
			});
	};
};

export const requestAddFollowing = followingId => {
	return {
		type: TuneupActionTypes.REQUEST_ADD_FOLLOWING,
		followingId
	};
};

export const doneAddFollowing = (followingId, following) => {
	return {
		type: TuneupActionTypes.DONE_ADD_FOLLOWING,
		followingId,
		following
	};
};

export const addFollowing = followingId => {
	return dispatch => {
		// get following object from api
		dispatch(requestAddFollowing(followingId));
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-access-token': shared.getTuneupToken,
			},
			body: JSON.stringify({
				add: true,
				followingId: followingId 
			}),
		};

		fetch('/following', options).then(response => response.json())
			.then(body => {
				if (!body.success)
					throw 'Could not add following'; 
				else {
					const following = body.following;
					return dispatch(doneAddFollowing(followingId,following));
				}
			}).catch(err => {
				console.error(err);
				return dispatch(apiError(TuneupActionTypes.ADD_FOLLOWING));
			});
	};
};

export const requestRemoveFollowing = followingId => {
	return {
		type: TuneupActionTypes.REQUEST_REMOVE_FOLLOWING,
		followingId
	};
};

export const doneRemoveFollowing = followingId => {
	return {
		type: TuneupActionTypes.DONE_REMOVE_FOLLOWING,
		followingId
	};
};

export const removeFollowing = followingId => {
	return dispatch => {
		dispatch(requestRemoveFollowing(followingId));

		// make api call to remove following
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'x-access-token': shared.getTuneupToken,
			},
			body: JSON.stringify({
				add: false,
				followingId: followingId 
			}),
		};

		fetch('/following', options).then(response => response.json())
			.then(body => {
				if (!body.success)
					throw 'Could not remove following'; 
				else {
					return dispatch(doneRemoveFollowing(followingId));
				}
			}).catch(err => {
				console.error(err);
				return dispatch(apiError(TuneupActionTypes.REMOVE_FOLLOWING));
			});
	};
};

export const updateCurrentTrack = (trackInfo, userId) => {
	return {
		type: TuneupActionTypes.UPDATE_CURRENT_TRACK,
		trackInfo,
		userId
	};
};

export const updateRecents = (tracksInfo, userId) => {
	return {
		type: TuneupActionTypes.UPDATE_RECENTS,
		tracksInfo,
		userId
	};
};

export const apiError = errorType => {
	return {
		type: TuneupActionTypes.API_ERROR,
		errorType
	};
};