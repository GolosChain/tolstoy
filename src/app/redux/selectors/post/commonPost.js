import { Map, List } from 'immutable';
import memoize from 'lodash/memoize';
import { createSelector } from 'reselect';
import {
    createDeepEqualSelector,
    currentUsernameSelector,
    currentUserSelector,
    dataSelector,
    globalSelector,
    parseJSON,
} from '../common';

import { extractPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { detransliterate, parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { calcVotesStats } from 'app/utils/StateFunctions';
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

const getMyVote = (post, username) => {
    const votes = post.get('active_votes');
    if (votes) {
        for (let vote of votes) {
            if (vote.get('voter') === username) {
                const myVote = vote.toJS();
                myVote.weight = parseInt(myVote.weight || 0, 10);
                return myVote;
            }
        }
    }
    return 0;
};

export const postSelector = createSelector(
    [globalSelector('content'), (state, permLink) => permLink],
    (content, permLink) => content.get(permLink)
);

export const routePostSelector = createDeepEqualSelector(
    [globalSelector('content'), postUrlFromPathnameSelector],
    (content, url) => content.get(url)
);

export const votesSummarySelector = createDeepEqualSelector(
    [routePostSelector, currentUserSelector],
    (post, currentUser) => {
        return calcVotesStats(post.get('active_votes').toJS(), currentUser);
    }
);

export const currentPostSelector = createDeepEqualSelector(
    [routePostSelector, dataSelector('favorites'), currentUsernameSelector],
    (post, favorites, username) => {
        if (!post) {
            return null;
        }

        const author = post.get('author');
        const permLink = post.get('permlink');
        const myVote = getMyVote(post, username);

        let metadata;

        try {
            metadata = parseJSON(post.get('json_metadata'));
        } catch (err) {}

        const tags = (metadata && metadata.tags || []).filter(tag => tag);

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
            author,
            permLink,
            children: post.get('children'),
            link: `/@${author}/${permLink}`,
            url: post.get('url'),
            myVote,
            promotedAmount: parsePayoutAmount(post.get('promoted')),
            comments: post.get('comments'),
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
