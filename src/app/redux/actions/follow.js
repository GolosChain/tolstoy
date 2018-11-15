import { FOLLOWERS_UPDATE_FOLLOW } from '../constants/followers';

export function updateFollow(follower, following, action, callback) {
    return {
        type: FOLLOWERS_UPDATE_FOLLOW,
        payload: {
            follower,
            following,
            action,
            callback,
        },
    };
}
