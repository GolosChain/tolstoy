import {
    createDeepEqualSelector,
    currentUserSelector,
    dataSelector,
    globalSelector,
    routerParamSelector,
} from '../common';
import { parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { Set } from 'immutable';

export const currentPostSelector = createDeepEqualSelector(
    [
        globalSelector('content'),
        routerParamSelector('username'),
        routerParamSelector('slug'),
        dataSelector('favorites'),
    ],
    (content, username, slug, favorites) => {
        const post = content.get(`${username}/${slug}`);
        if (!post) return null;
        const author = post.get('author');
        const permLink = post.get('permlink');
        return {
            created: post.get('created'),
            isFavorite: favorites.set.includes(author + '/' + permLink),
            tags: JSON.parse(post.get('json_metadata')).tags,
            payout:
                parsePayoutAmount(post.get('pending_payout_value')) +
                parsePayoutAmount(post.get('total_payout_value')),
            category: post.get('category'),
            title: post.get('title'),
            body: post.get('body'),
            jsonMetadata: post.get('json_metadata'),
            pictures: post.getIn(['stats', 'pictures']),
            author,
            permLink,
            children: post.get('children'),
            link: `/@${author}/${permLink}`,
            data: post,
        };
    }
);

const followingSelector = createDeepEqualSelector(
    [globalSelector('follow'), currentUserSelector],
    (follow, user) => {
        return follow
            .getIn(['getFollowingAsync', user.get('username'), 'blog_result'], Set())
            .toJS();
    }
);

export const authorSelector = createDeepEqualSelector(
    [
        globalSelector('accounts'),
        globalSelector('follow_count'),
        followingSelector,
        currentPostSelector,
    ],
    (accounts, followCount, following, post) => {
        const authorAccountName = post.author;
        const authorData = accounts.get(authorAccountName);
        const jsonData = normalizeProfile({
            json_metadata: authorData.get('json_metadata'),
            name: authorAccountName,
        });

        return {
            name: jsonData.name || authorAccountName,
            account: authorAccountName,
            about: jsonData.about,
            isFollow: following.includes(authorAccountName),
            followerCount:
                (followCount && followCount.getIn([authorAccountName, 'follower_count'])) || 0,
            pinnedPosts: extractPinnedPostData(authorData.get('json_metadata')),
        };
    }
);

const extractPinnedPostData = metadata => {
    try {
        return JSON.parse(metadata).pinnedPosts || [];
    } catch (error) {
        return [];
    }
};

export const sidePanelSelector = createDeepEqualSelector([currentPostSelector], post => [
    {
        iconName: 'like',
        count: post.data.get('net_votes'),
    },
    {
        iconName: 'dislike',
        count: 18,
    },
    {
        iconName: 'repost-right',
        count: 20,
    },
    {
        iconName: 'sharing_triangle',
        count: null,
    },
    {
        iconName: 'star',
        count: null,
    },
]);

export const activePanelTooltipSelector = createDeepEqualSelector([], () => [
    {
        iconName: 'pin',
        text: 'Закрепить пост',
    },
    {
        iconName: 'brilliant',
        text: 'Продвинуть пост',
    },
    {
        iconName: 'complain_normal',
        text: 'Пожаловаться на пост',
    },
]);
