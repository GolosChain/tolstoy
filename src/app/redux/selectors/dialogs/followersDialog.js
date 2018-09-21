import { Map, OrderedSet } from 'immutable';
import { createDeepEqualSelector, globalSelector, pageAccountSelector } from './../common';
const emptyMap = Map();
const emptyOrderedSet = OrderedSet();

const getMethodPathByType = (state, { type }) =>
    type === 'follower' ? 'getFollowersAsync' : 'getFollowingAsync';
const getCountPathByType = (state, { type }) =>
    type === 'follower' ? 'follower_count' : 'following_count';

const followSelector = createDeepEqualSelector(
    [
        globalSelector('follow'),
        getMethodPathByType,
        (state, { pageAccountName }) => pageAccountName,
    ],
    (follow, path, pageAccountName) => follow.getIn([path, pageAccountName], emptyMap)
);

const followCountSelector = createDeepEqualSelector(
    [
        globalSelector('follow_count'),
        getCountPathByType,
        (state, { pageAccountName }) => pageAccountName,
    ],
    (followCount, path, pageAccountName) => followCount.getIn([pageAccountName, path], 0)
);

export const followersDialogSelector = createDeepEqualSelector(
    [globalSelector('accounts'), followSelector, followCountSelector],
    (accounts, follow, followCount) => {
        const loadingFollow =
            follow.get('blog_loading', false) || follow.get('ignore_loading', false);
        const namesFollow = follow.get('blog_result', emptyOrderedSet);
        const users = namesFollow.map(name => accounts.get(name));

        return {
            loadingFollow,
            followCount,
            users,
        };
    }
);
