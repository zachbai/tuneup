import TuneupActionTypes from './TuneupActionTypes';
import shared from '../core/shared';

const UserActions = {
    requestAddFollower(followerId) {
        return {
            type: TuneupActionTypes.REQUEST_ADD_FOLLOWER,
            followerId,
            follower
        };
    },

    doneAddFollower(followerId, follower) {
        return {
            type: TuneupActionTypes.DONE_ADD_FOLLOWER,
            followerId,
            follower
        };
    },

    addFollower(followerId) {
        return dispatch => {
            // get follower object from api
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
        }
    },

    requestRemoveFollower(followerId) {
        return {
            type: TuneupActionTypes.REQUEST_REMOVE_FOLLOWER,
            followerId
        };
    },

    doneRemoveFollower(followerId) {
        return {
            type: TuneupActionTypes.DONE_REMOVE_FOLLOWER,
            followerId
        };
    },

    removeFollower(followerId) {
        // make api call to remove follower
        return dispatch => {
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
                    throw "Could not remove follower"; 
                else 
                    return dispatch(doneRemoveFollower(followerId))
            }).catch(err => {
                console.error(err);
                return dispatch(apiError(TuneupActionTypes.REMOVE_FOLLOWER));
            });
        }
    },

    requestAddFollowing(followingId) {
        return {
            type: TuneupActionTypes.REQUEST_ADD_FOLLOWING,
            followingId
        };
    },

    doneAddFollowing(followingId, following) {
        return {
            type: TuneupActionTypes.DONE_ADD_FOLLOWING,
            followingId,
            following
        }
    },

    addFollowing(followingId) {
        return { type: TuneupActionTypes.ADD_FOLLOWING,
            followingId,
            following
        };
        // get following object from api
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
                throw "Could not add following"; 
            else {
                const following = body.following;
                return dispatch(doneAddFollowing(followingId,following));
            }
        }).catch(err => {
            console.error(err);
            return dispatch(apiError(TuneupActionTypes.ADD_FOLLOWING));
        });
    },

    requestRemoveFollowing(followingId) {
        return {
            type: TuneupActionTypes.REQUEST_REMOVE_FOLLOWING,
            followingId
        };
    },

    doneRemoveFollowing(followingId) {
        return {
            type: TuneupActionTypes.DONE_REMOVE_FOLLOWING,
            followingId
        };
    },

    removeFollowing(followingId) {
        return {
            type: TuneupActionTypes.REMOVE_FOLLOWING,
            followingId
        };
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
                throw "Could not remove following"; 
            else {
                return dispatch(doneRemoveFollowing(followingId));
            }
        }).catch(err => {
            console.error(err);
            return dispatch(apiError(TuneupActionTypes.REMOVE_FOLLOWING));
        });
    },

    updateCurrentTrack(trackInfo, userId) {
        return {
            type: TuneupActionTypes.UPDATE_CURRENT_TRACK,
            currentTrack,
            userId
        };
    },

    updateRecents(trackIds, userId) {
        return {
            type: TuneupActionTypes.UPDATE_RECENTS,
            recents,
            userId
        };
    },

    apiError(errorType) {
        return {
            type: TuneupActionTypes.API_ERROR,
            errorType
        };
    }
};

export default UserActions;