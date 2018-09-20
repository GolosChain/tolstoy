import {createDeepEqualSelector, currentUserSelector, globalSelector} from '../common';

const followingSelector = createDeepEqualSelector(
    [globalSelector('follow'), currentUserSelector],
    (follow, user) => {
        return follow
            .getIn(['getFollowingAsync', user.get('username'), 'blog_result'], Set())
            .toJS();
    }
);

const mutingSelector = createDeepEqualSelector(
    [globalSelector('follow'), currentUserSelector],
    (mute, user) => {
        return mute
            .getIn(['getFollowingAsync', user.get('username'), 'ignore_result'], Set())
            .toJS();
    }
);

export const followSelector = createDeepEqualSelector(
    [followingSelector, mutingSelector, ({props: {following}}) => following],
    (follow, mute, following) => {
        return {
            isFollow: follow.includes(following),
            isMute: mute.includes(following),
        }
    }
);
