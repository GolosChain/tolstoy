import { pathOr, filter } from 'ramda';

import { processBlog } from 'shared/state';
import resolveRoute from 'app/ResolveRoute';
import { reverseTag, prepareTrendingTags } from 'app/utils/tags';
import { IGNORE_TAGS, PUBLIC_API } from 'app/client_config';
import { TAGS_FILTER_TYPES, COUNT_OF_TAGS } from 'src/app/redux/constants/common';

const DEFAULT_VOTE_LIMIT = 10000;
const COUNT_TAGS_ON_PAGE = 250;

export default async function getState(api, url = '/', options, offchain, settings) {
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
    };

    const accounts = new Set();

    // by default trending tags limit=50, but if we in '/tags/' path then limit = 250
    const tagsLimit = route.page === 'Tags' ? COUNT_TAGS_ON_PAGE : COUNT_OF_TAGS.EXPANDED;
    const trendingTags = await api.getTrendingTagsAsync('', tagsLimit);

    state.tag_idx = {
        trending: prepareTrendingTags(trendingTags),
    };

    let stateFillerFunction = null;

    if (route.page === 'UserProfile') {
        stateFillerFunction = getStateForProfile;
    } else if (route.page === 'Post') {
        stateFillerFunction = getStateForPost;
    } else if (route.page === 'Witnesses') {
        stateFillerFunction = getStateForWitnesses;
    } else if (route.page === 'Tags') {
        stateFillerFunction = getStateForTags;
    } else if (
        PUBLIC_API[routeParts[0]] ||
        (route.page === 'PostsIndex' && route.params.username)
    ) {
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
            settings,
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

async function getStateForWitnesses(state, route, { api }) {
    const witnesses = await api.getWitnessesByVoteAsync('', 100);

    for (let witness of witnesses) {
        state.witnesses[witness.owner] = witness;
    }
}

async function getStateForApi(state, { params }, { routeParts, api, settings }) {
    const args = { limit: 20, truncate_body: 1024 };

    let discussionsType, tag;

    // Home page
    if (params && params.category && params.username) {
        const { category, username } = params;
        const [account] = await api.getAccountsAsync([username]);
        if (!account) {
            return;
        }
        state.accounts[username] = account;

        args.select_authors = [username];
        discussionsType = category;
    } else {
        // decode tag for cyrillic symbols
        tag = routeParts[1] !== undefined ? decodeURIComponent(routeParts[1]) : '';
        discussionsType = routeParts[0];
    }

    let discussionsKey;

    if (typeof tag === 'string' && tag.length) {
        const reversed = reverseTag(tag);
        if (reversed) {
            args.select_tags = [tag, reversed];
        } else {
            args.select_tags = [tag];
        }

        discussionsKey = tag;
    } else {
        const selectedTags = pathOr({}, ['basic', 'selectedTags'], settings);

        const select_tags = Object.keys(
            filter(type => type === TAGS_FILTER_TYPES.SELECT, selectedTags)
        );
        if (select_tags && select_tags.length) {
            let selectTags = [];

            select_tags.forEach(t => {
                const reversed = reverseTag(t);
                if (reversed) {
                    selectTags.push(t, reversed);
                } else {
                    selectTags.push(t);
                }
            });
            args.select_tags = selectTags;
        }

        const filter_tags = Object.keys(
            filter(type => type === TAGS_FILTER_TYPES.EXCLUDE, selectedTags)
        );
        if (filter_tags && filter_tags.length) {
            let filterTags = [];

            filter_tags.forEach(t => {
                const reversed = reverseTag(t);
                if (reversed) {
                    filterTags.push(t, reversed);
                } else {
                    filterTags.push(t);
                }
            });
            args.filter_tags = filterTags;
        } else {
            args.filter_tags = IGNORE_TAGS;
        }

        const selectedSelectTags = select_tags
            .filter(tag => !tag.startsWith('ru--'))
            .sort()
            .join('/');
        const selectedFilterTags = filter_tags
            .filter(tag => !tag.startsWith('ru--'))
            .sort()
            .join('/');

        const arrSelectedTags = [];
        if (selectedSelectTags) {
            arrSelectedTags.push(selectedSelectTags);
        }

        if (selectedFilterTags) {
            arrSelectedTags.push(selectedFilterTags);
        }

        discussionsKey = arrSelectedTags.join('|');
    }

    const discussions = await api[PUBLIC_API[discussionsType]](args);

    const discussion_idxes = {
        [discussionsType]: [],
    };

    for (let discussion of discussions) {
        const link = `${discussion.author}/${discussion.permlink}`;
        discussion_idxes[discussionsType].push(link);
        state.content[link] = discussion;
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
