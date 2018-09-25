import { Map } from 'immutable';
import {
    FOLLOWERS_GET_FOLLOWERS,
    FOLLOWERS_GET_FOLLOWERS_SUCCESS,
    FOLLOWERS_GET_FOLLOWERS_ERROR,
    FOLLOWERS_GET_FOLLOWING,
    FOLLOWERS_GET_FOLLOWING_SUCCESS,
    FOLLOWERS_GET_FOLLOWING_ERROR,
} from 'src/app/redux/constants/followers';

/*
{
    [accountName]: {
        followers: {
            [type]: {
                loading: false
            }
        }
        following: {
            [type]: {
                loading: false
            }
        }
    }
}
*/

const initialState = Map();

export default function(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case FOLLOWERS_GET_FOLLOWERS:
            return state.setIn(
                [payload.following, 'followers', payload.followType, 'loading'],
                true
            );

        case FOLLOWERS_GET_FOLLOWERS_SUCCESS:
            return state.setIn([meta.following, 'followers', meta.followType, 'loading'], false);

        case FOLLOWERS_GET_FOLLOWERS_ERROR:
            return state.setIn([meta.following, 'followers', meta.followType, 'loading'], false);

        case FOLLOWERS_GET_FOLLOWING:
            return state.setIn(
                [payload.follower, 'following', payload.followType, 'loading'],
                true
            );

        case FOLLOWERS_GET_FOLLOWING_SUCCESS:
            return state.setIn([meta.follower, 'following', meta.followType, 'loading'], false);

        case FOLLOWERS_GET_FOLLOWING_ERROR:
            return state.setIn([meta.follower, 'following', meta.followType, 'loading'], false);

        default:
            return state;
    }
}
