import { Map, List } from 'immutable';
import memoize from 'lodash/memoize';
import { createSelector } from 'reselect';
import { createDeepEqualSelector, dataSelector, globalSelector, parseJSON } from '../common';

import { extractPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { detransliterate, parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { extractContentMemoized, extractRepost } from 'app/utils/ExtractContent';

const emptyMap = Map();
const emptyList = List();

const pathnameSelector = state => {
    return state.routing.locationBeforeTransitions.pathname;
};

const postUrlFromPathnameSelector = createDeepEqualSelector([pathnameSelector], pathname => {
    // transform /test/@some-account/post-name/edit?kek=3#lol into some-account/post-name
    const match = pathname.match(/@([^\/]+\/[^?#\/]+)/);

    if (!match) {
        return null;
    }

    return match[1];
});

export const postSelector = createSelector(
    [globalSelector('content'), (state, permLink) => permLink],
    (content, permLink) => content.get(permLink)
);

export const routePostSelector = createDeepEqualSelector(
    [globalSelector('content'), postUrlFromPathnameSelector],
    (content, url) => content.get(url)
);

export const currentPostSelector = createDeepEqualSelector(
    [routePostSelector, dataSelector('favorites')],
    (post, favorites) => {
        if (!post) {
            return null;
        }

        const author = post.get('author');
        const permLink = post.get('permlink');

        let metadata;

        try {
            metadata = parseJSON(post.get('json_metadata'));
        } catch (err) {}

        const tags = ((metadata && metadata.tags) || []).filter(tag => tag);
        const desc = extractRepost(post.get('body'));

        return {
            created: post.get('created'),
            isFavorite: favorites.set.includes(author + '/' + permLink),
            tags: tags.map(tag => ({
                origin: tag,
                tag: detransliterate(tag),
            })),
            payout:
                parsePayoutAmount(post.get('pending_payout_value')) +
                parsePayoutAmount(post.get('total_payout_value')),
            category: {
                origin: post.get('category'),
                tag: detransliterate(post.get('category')),
            },
            title: post.get('title'),
            body: post.get('body'),
            metadata,
            pictures: post.getIn(['stats', 'pictures']),
            desc,
            author,
            permLink,
            children: post.get('children'),
            link: `/@${author}/${permLink}`,
            url: post.get('url'),
            promotedAmount: parsePayoutAmount(post.get('promoted')),
            comments: post.get('comments'),
            stats: post.get('stats').toJS(),
        };
    }
);

export const authorSelector = createDeepEqualSelector(
    [
        globalSelector('accounts'),
        globalSelector('follow_count'),
        currentPostSelector,
        globalSelector('content'),
    ],
    (accounts, followCount, post, content) => {
        let authorAccountName = '';
        if (post) {
            authorAccountName = post.author;
        }
        const authorData = accounts.get(authorAccountName) || emptyMap;
        const jsonData = normalizeProfile({
            json_metadata: authorData.get('json_metadata'),
            name: authorAccountName,
        });

        const pinnedPostsUrls = extractPinnedPosts(authorData.get('json_metadata'));

        return {
            name: jsonData.name || authorAccountName,
            account: authorAccountName,
            about: jsonData.about,
            followerCount:
                (followCount && followCount.getIn([authorAccountName, 'follower_count'])) || 0,
            pinnedPostsUrls,
            pinnedPosts: pinnedPostsUrls
                .map(url => content.get(url))
                .filter(post => !!post)
                .map(post => ({
                    title: post.get('title'),
                    url: post.get('url'),
                })),
            created: authorData.get('created'),
        };
    }
);

export const commentsSelector = createDeepEqualSelector(
    [currentPostSelector, state => state.data.comments, state => state.status.comments],
    (post, comments, status) => {
        const postAuthor = post.author;
        const postPermLink = post.permLink;
        const permLink = `${postAuthor}/${postPermLink}`;
        return {
            postAuthor: post.author,
            postPermLink: post.permLink,
            commentsCount: post.children,
            comments: comments.getIn([permLink], emptyList),
            isFetching: status.get('isFetching'),
        };
    }
);

export const sanitizeCardPostData = memoize(data => {
    const result = extractContentMemoized(data);

    let desc = result.desc;

    if (result.image_link) {
        desc = desc.replace(result.image_link, '');
    }

    return {
        ...result,
        desc,
        html: { __html: desc },
    };
});

export const sanitizeRepostData = memoize(data => {
    return {
        __html: extractRepost(data),
    };
});
