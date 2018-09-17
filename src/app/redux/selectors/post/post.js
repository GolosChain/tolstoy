import {
    createDeepEqualSelector,
    currentUserSelector,
    dataSelector,
    globalSelector,
} from '../common';
import { detransliterate, parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { Set } from 'immutable';
import { calcVotesStats } from '../../../../../app/utils/StateFunctions';

const pathnameSelector = state => {
    return state.routing.locationBeforeTransitions.pathname;
};

const postUrlFromPathnameSelector = createDeepEqualSelector([pathnameSelector], pathname =>
    pathname.substr(pathname.indexOf('@') + 1)
);

export const postSelector = createDeepEqualSelector(
    [globalSelector('content'), postUrlFromPathnameSelector],
    (content, url) => content.get(url)
);

export const votesSummarySelector = createDeepEqualSelector(
    [postSelector, currentUserSelector],
    (post, currentUser) => {
        return calcVotesStats(post.get('active_votes').toJS(), currentUser);
    }
);

export const repostSelector = createDeepEqualSelector([], () => 0);

export const currentPostSelector = createDeepEqualSelector(
    [postSelector, dataSelector('favorites')],
    (post, favorites) => {
        if (!post) return null;
        const author = post.get('author');
        const permLink = post.get('permlink');
        return {
            created: post.get('created'),
            isFavorite: favorites.set.includes(author + '/' + permLink),
            tags: JSON.parse(post.get('json_metadata')).tags.map(tag => detransliterate(tag)),
            payout:
                parsePayoutAmount(post.get('pending_payout_value')) +
                parsePayoutAmount(post.get('total_payout_value')),
            category: detransliterate(post.get('category')),
            title: post.get('title'),
            body: post.get('body'),
            jsonMetadata: post.get('json_metadata'),
            pictures: post.getIn(['stats', 'pictures']),
            author,
            permLink,
            children: post.get('children'),
            link: `/@${author}/${permLink}`,
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
        globalSelector('content'),
    ],
    (accounts, followCount, following, post, content) => {
        const authorAccountName = post.author;
        const authorData = accounts.get(authorAccountName);
        const jsonData = normalizeProfile({
            json_metadata: authorData.get('json_metadata'),
            name: authorAccountName,
        });
        const pinnedPostsUrls = extractPinnedPostData(authorData.get('json_metadata'));
        return {
            name: jsonData.name || authorAccountName,
            account: authorAccountName,
            about: jsonData.about,
            isFollow: following.includes(authorAccountName),
            followerCount:
                (followCount && followCount.getIn([authorAccountName, 'follower_count'])) || 0,
            pinnedPostsUrls,
            pinnedPosts: pinnedPostsUrls
                .map(url => content.get(url))
                .filter(post => !!post)
                .map(post => {
                    return {
                        title: post.get('title'),
                        url: post.get('url'),
                    };
                }),
            created: authorData.get('created'),
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
