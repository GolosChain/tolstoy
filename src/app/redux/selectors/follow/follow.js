import { createDeepEqualSelector, currentUserSelector, globalSelector } from '../common';
import { Set } from 'immutable';

const emptySet = Set();

export const followingSelector = type =>
    createDeepEqualSelector([globalSelector('follow'), currentUserSelector], (follow, user) => {
        return follow.getIn(['getFollowingAsync', user.get('username'), type], emptySet);
    });

export const followSelector = createDeepEqualSelector(
    [followingSelector('blog_result'), (state, props) => props.following],
    (follow, following) => ({
        isFollow: follow.includes(following),
    })
);

export const muteSelector = createDeepEqualSelector(
    [followingSelector('ignore_result'), (state, props) => props.muting],
    (mute, muting) => ({
        isMute: mute.includes(muting),
    })
);
