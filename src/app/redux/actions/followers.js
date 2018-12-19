import {
    FOLLOWERS_GET_FOLLOWERS,
    FOLLOWERS_GET_FOLLOWING,
    USER_FOLLOW_DATA_LOAD,
} from 'src/app/redux/constants/followers';
import { USERS_PER_PAGE } from 'src/app/redux/constants/common';

export function getFollowers({
    following,
    startFollower = '',
    followType = 'blog',
    limit = USERS_PER_PAGE,
}) {
    return {
        type: FOLLOWERS_GET_FOLLOWERS,
        payload: {
            following,
            startFollower,
            followType,
            limit,
        },
    };
}

export function getFollowing({
    follower,
    startFollowing = '',
    followType = 'blog',
    limit = USERS_PER_PAGE,
}) {
    return {
        type: FOLLOWERS_GET_FOLLOWING,
        payload: {
            follower,
            startFollowing,
            followType,
            limit,
        },
    };
}

export function loadUserFollowData(username) {
    return {
        type: USER_FOLLOW_DATA_LOAD,
        payload: {
            username,
        },
    };
}
