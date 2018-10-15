import { createSelector } from 'reselect';
import { Set } from 'immutable';

import { currentUserSelector, globalSelector } from '../common';

const emptySet = Set();

export const followingSelector = type =>
    createSelector([globalSelector('follow', emptySet), currentUserSelector], (follow, user) => {
        return follow.getIn(['getFollowingAsync', user.get('username'), type], emptySet);
    });

export const followSelector = createSelector(
    [followingSelector('blog_result'), (state, props) => props.following],
    (follow, following) => ({
        isFollow: follow.includes(following),
    })
);

export const muteSelector = createSelector(
    [followingSelector('ignore_result'), (state, props) => props.muting],
    (mute, muting) => ({
        isMute: mute.includes(muting),
    })
);
