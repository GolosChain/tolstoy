export function updateFollow(follower, following, action, callback) {
    return {
        type: 'user/UPDATE_FOLLOW',
        payload: {
            follower,
            following,
            action,
            callback,
        },
    };
}
