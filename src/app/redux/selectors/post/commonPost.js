import { Map, List } from 'immutable';
import {
    createDeepEqualSelector,
    currentUsernameSelector,
    currentUserSelector,
    dataSelector,
    globalSelector,
} from '../common';
import { extractPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';
import { detransliterate, parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { calcVotesStats } from 'app/utils/StateFunctions';

const emptyMap = Map();
const emptyList = List();

const pathnameSelector = state => {
    return state.routing.locationBeforeTransitions.pathname;
};

const postUrlFromPathnameSelector = createDeepEqualSelector([pathnameSelector], pathname =>
    pathname.substring(pathname.indexOf('#') + 1).substr(pathname.indexOf('@') + 1)
);

const getMyVote = (post, username) => {
    const votes = post.get('active_votes');
    for (let vote of votes) {
        if (vote.get('voter') === username) {
            const myVote = vote.toJS();
            myVote.weight = parseInt(myVote.weight || 0, 10);
            return myVote;
        }
    }
    return 0;
};

export const postSelector = createDeepEqualSelector(
    [globalSelector('content'), postUrlFromPathnameSelector],
    (content, url) => content.get(url) || emptyMap
);

export const votesSummarySelector = createDeepEqualSelector(
    [postSelector, currentUserSelector],
    (post, currentUser) => {
        return calcVotesStats(post.get('active_votes').toJS(), currentUser);
    }
);

export const currentPostSelector = createDeepEqualSelector(
    [postSelector, dataSelector('favorites'), currentUsernameSelector],
    (post, favorites, username) => {
        if (!post) return null;
        const author = post.get('author');
        const permLink = post.get('permlink');
        const myVote = getMyVote(post, username);
        const tags = JSON.parse(post.get('json_metadata')).tags || [];

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
            jsonMetadata: post.get('json_metadata'),
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
        const authorAccountName = post.author;
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
