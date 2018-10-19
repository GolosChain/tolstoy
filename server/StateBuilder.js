import { processBlog } from 'shared/state';
import resolveRoute from 'app/ResolveRoute';
import { reveseTag, prepareTrendingTags } from 'app/utils/tags';
import { PUBLIC_API } from 'app/client_config';

const DEFAULT_VOTE_LIMIT = 10000;

export default async function getState(api, url = '/', options, offchain) {
    const route = resolveRoute(url);

    const normalizedUrl = url.replace(/^\//, '');
    const routeParts = normalizedUrl.split('/');

    const state = {
        current_route: url === '/' ? 'trending' : url, // used for testing
        props: await api.getDynamicGlobalPropertiesAsync(),
        categories: {},
        tags: {},
        content: {},
        accounts: {},
        witnesses: {},
        discussion_idx: {},
        select_tags: [],
    };

    const accounts = new Set();

    // by default trending tags limit=50, but if we in '/tags/' path then limit = 250
    const tagsLimit = route.page === 'Tags' ? 250 : 50;
    const trendingTags = await api.getTrendingTagsAsync('', tagsLimit);

    state.tag_idx = {
        trending: prepareTrendingTags(trendingTags),
    };

    let stateFillerFunction = null;

    if (route.page === 'UserProfile' || (route.page === 'PostsIndex' && route.params.username)) {
        stateFillerFunction = getStateForProfile;
    } else if (route.page === 'Post') {
        stateFillerFunction = getStateForPost;
    } else if (route.page === 'Witnesses') {
        stateFillerFunction = getStateForWitnesses;
    } else if (route.page === 'Tags') {
        stateFillerFunction = getStateForTags;
    } else if (PUBLIC_API[routeParts[0]]) {
        stateFillerFunction = getStateForApi;
    }

    if (stateFillerFunction) {
        await stateFillerFunction(state, route, {
            offchain,
            routeParts,
            api,
            trendingTags,
            accounts,
            options,
        });
    }

    if (accounts.size > 0) {
        const accountsData = await api.getAccountsAsync(Array.from(accounts));

        for (let accountData of accountsData) {
            state.accounts[accountData.name] = accountData;
        }
    }

    return state;
}

async function getStateForProfile(state, route, { api }) {
    const username = route.params.username;

    const [account] = await api.getAccountsAsync([username]);

    if (!account) {
        return;
    }

    state.accounts[username] = account;

    state.accounts[username].tags_usage = await api.getTagsUsedByAuthorAsync(username);
    state.accounts[username].guest_bloggers = await api.getBlogAuthorsAsync(username);

    switch (route.params.category) {
        case 'recent-replies':
            const replies = await api.getRepliesByLastUpdateAsync(
                username,
                '',
                50,
                DEFAULT_VOTE_LIMIT
            );

            state.accounts[username].recent_replies = [];

            for (let reply of replies) {
                const link = `${reply.author}/${reply.permlink}`;
                state.content[link] = reply;
                state.accounts[username].recent_replies.push(link);
            }
            break;

        case 'posts':
        case 'comments':
            const comments = await api.getDiscussionsByCommentsAsync({
                start_author: username,
                limit: 20,
            });

            state.accounts[username].comments = [];

            for (let comment of comments) {
                const link = `${comment.author}/${comment.permlink}`;
                state.content[link] = comment;
                state.accounts[username].comments.push(link);
            }
            break;

        case 'feed':
            const feedEntries = await api.getFeedEntriesAsync(username, 0, 20);
            state.accounts[username].feed = [];

            for (let entry of feedEntries) {
                const link = `${entry.author}/${entry.permlink}`;

                state.accounts[username].feed.push(link);

                const postContent = await api.getContentAsync(
                    entry.author,
                    entry.permlink,
                    DEFAULT_VOTE_LIMIT
                );

                state.content[link] = postContent;

                if (entry.reblog_by.length > 0) {
                    postContent.first_reblogged_by = entry.reblog_by[0];
                    postContent.reblogged_by = entry.reblog_by;
                    postContent.first_reblogged_on = entry.reblog_on;
                }
            }
            break;

        case 'blog':
        default:
            try {
                await processBlog(state, {
                    uname: username,
                    voteLimit: DEFAULT_VOTE_LIMIT,
                });
            } catch (err) {
                console.error(err);
            }
    }
}

async function getStateForPost(state, route, { api, accounts }) {
    const routeParams = route.params;

    const account = route.params.username;

    const url = `${account}/${routeParams.permLink}`;

    state.content[url] = await api.getContentAsync(
        account,
        routeParams.permLink,
        DEFAULT_VOTE_LIMIT
    );

    accounts.add(account);

    const replies = await api.getAllContentRepliesAsync(
        account,
        routeParams.permLink,
        DEFAULT_VOTE_LIMIT
    );

    for (let reply of replies) {
        const link = `${reply.author}/${reply.permlink}`;

        state.content[link] = reply;

        accounts.add(reply.author);

        if (reply.parent_permlink === routeParams.permLink) {
            state.content[url].replies.push(link);
        }
    }
}

async function getStateForWitnesses(state) {
    const witnesses = await api.getWitnessesByVoteAsync('', 100);

    for (let witness of witnesses) {
        state.witnesses[witness.owner] = witness;
    }
}

async function getStateForApi(state, params, { offchain, routeParts, options, api }) {
    const args = { limit: 20, truncate_body: 1024 };
    const discussionsType = routeParts[0];

    // decode tag for cyrillic symbols
    const tag = routeParts[1] !== undefined ? decodeURIComponent(routeParts[1]) : '';

    if (typeof tag === 'string' && tag.length) {
        const reversed = reveseTag(tag);
        reversed ? (args.select_tags = [tag, reversed]) : (args.select_tags = [tag]);
    } else {
        if (typeof offchain.select_tags === 'object' && offchain.select_tags.length) {
            let selectTags = [];

            offchain.select_tags.forEach(t => {
                const reversed = reveseTag(t);
                reversed
                    ? (selectTags = [...selectTags, t, reversed])
                    : (selectTags = [...selectTags, t]);
            });
            args.select_tags = state.select_tags = selectTags;
        } else {
            args.filter_tags = state.filter_tags = options.IGNORE_TAGS;
        }
    }

    const discussions = await api[PUBLIC_API[discussionsType]](args);

    const discussion_idxes = {};
    discussion_idxes[discussionsType] = [];

    for (let discussion of discussions) {
        const link = `${discussion.author}/${discussion.permlink}`;
        discussion_idxes[discussionsType].push(link);
        state.content[link] = discussion;
    }

    let discussionsKey;

    if (typeof tag === 'string' && tag) {
        discussionsKey = tag;
    } else {
        discussionsKey = state.select_tags
            .sort()
            .filter(t => !t.startsWith('ru--'))
            .join('/');
    }

    state.discussion_idx[discussionsKey] = discussion_idxes;
}

async function getStateForTags(state, params, { trendingTags }) {
    const tags = {};

    for (let tag of trendingTags) {
        tags[tag.name] = tag;
    }

    state.tags = tags;
}
