import {createDeepEqualSelector, currentUserSelector, globalSelector} from '../common';
import { Set, is } from 'immutable';


export const followSelector = createDeepEqualSelector(
    [globalSelector('follow'), (state, props) => props.following, currentUserSelector],
    (followData, following, user) => {
        const follow = followData.getIn(['getFollowingAsync', user.get('username'), 'blog_result'], Set());
        const mute = followData.getIn(['getFollowingAsync', user.get('username'), 'ignore_result'], Set());
        return {
            isFollow: false,
            isMute: false
        }
    }
);
