import { Map, OrderedSet } from 'immutable';
import {
    FOLLOWERS_GET_FOLLOWERS_SUCCESS,
    FOLLOWERS_GET_FOLLOWING_SUCCESS,
} from 'src/app/redux/constants/followers';

/*
{
    [accountName]: {
        followers: {
            [type]: []
        }
        following: {
            [type]: []
        }
    }
}
*/

const initialState = Map();

export default function(state = initialState, { type, payload, error, meta }) {
    switch (type) {
        case FOLLOWERS_GET_FOLLOWERS_SUCCESS:
            return state.updateIn([meta.following, 'followers'], Map(), m => {
                m = m.asMutable();
                payload.forEach(item => {
                    item.what.forEach(type => {
                        m.update(type, OrderedSet(), s => s.add(item.follower));
                    });
                });
                return m.asImmutable();
            });

        case FOLLOWERS_GET_FOLLOWING_SUCCESS:
            return state.updateIn([meta.follower, 'following'], Map(), m => {
                m = m.asMutable();
                payload.forEach(item => {
                    item.what.forEach(type => {
                        m.update(type, OrderedSet(), s => s.add(item.following));
                    });
                });
                return m.asImmutable();
            });

        default:
            return state;
    }
}
