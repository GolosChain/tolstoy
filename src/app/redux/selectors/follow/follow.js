import {createDeepEqualSelector, currentUserSelector, globalSelector} from '../common';
import { Set } from 'immutable';


export const followSelector = createDeepEqualSelector(
    [globalSelector('follow'), ({props: {following}}) => following],
    (followData, following) => {
        const follow = followData.getIn(['getFollowingAsync', user.get('username'), 'blog_result'], Set());
        const mute = followData.getIn(['getFollowingAsync', user.get('username'), 'ignore_result'], Set());
        console.log(follow);
        console.log(mute);
        return {
            isFollow: false,
            isMute: false
        }
    }
);
