import { intersection } from 'ramda';

import { processBlog } from 'shared/state';
import resolveRoute from 'app/ResolveRoute';
import { reverseTags, prepareTrendingTags } from 'app/utils/tags';
import { IGNORE_TEST_TAGS, IGNORE_TAGS, PUBLIC_API } from 'app/client_config';
import { COUNT_OF_TAGS } from 'src/app/redux/constants/common';

const DEFAULT_VOTE_LIMIT = 10000;
const COUNT_TAGS_ON_PAGE = 250;

export default async function getState(
    api,
    { pathname = '/', query },
    { offchain, settings, rates }
) {
    pathname = pathname === '/' ? 'trending' : pathname;
    const route = resolveRoute(pathname);

    const normalizedUrl = pathname.replace(/^\//, '');
    const routeParts = normalizedUrl.split('/');

    const state = {
        global: {
            current_route: pathname === '/' ? 'trending' : pathname, // used for testing
            props: await api.getDynamicGlobalPropertiesAsync(),
            categories: {},
            tags: {},
            content: {},
            accounts: {},
            witnesses: {},
            discussion_idx: {},
        },
        offchain,
        data: {
            rates: {
                actual: rates,
                dates: [],
            },
        },
    };

    if (settings) {
        state.data.settings = settings;
    }

    const accounts = new Set();

    // by default trending tags limit=50, but if we in '/tags/' path then limit = 250
    const tagsLimit = route.page === 'Tags' ? COUNT_TAGS_ON_PAGE : COUNT_OF_TAGS.EXPANDED;
    const trendingTags = await api.getTrendingTagsAsync('', tagsLimit);

    state.global.tag_idx = {
        trending: prepareTrendingTags(trendingTags),
    };

    let stateFillerFunction = null;

    if (route.page === 'UserProfile') {
        stateFillerFunction = getStateForProfile;
    } else if (route.page === 'Post' || route.page === 'PostNoCategory') {
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
            query,
        });
    }

    if (accounts.size > 0) {
        const accountsData = await api.getAccountsAsync(Array.from(accounts));

        for (let accountData of accountsData) {
            state.global.accounts[accountData.name] = accountData;
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

    state.global.accounts[username] = account;

    switch (route.params.category) {
        case 'recent-replies':
            const replies = await api.getRepliesByLastUpdateAsync(
                username,
                '',
                50,
                DEFAULT_VOTE_LIMIT
            );

            state.global.accounts[username].recent_replies = [];

            for (let reply of replies) {
                const link = `${reply.author}/${reply.permlink}`;
                state.global.content[link] = reply;
                state.global.accounts[username].recent_replies.push(link);
            }
            break;

        case 'posts':
        case 'comments':
            const comments = await api.getDiscussionsByCommentsAsync({
                start_author: username,
                limit: 20,
            });

            state.global.accounts[username].comments = [];

            for (let comment of comments) {
                const link = `${comment.author}/${comment.permlink}`;
                state.global.content[link] = comment;
                state.global.accounts[username].comments.push(link);
            }
            break;

        case 'blog':
        default:
            try {
                await processBlog(state.global, {
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

    state.global.content[url] = await api.getContentAsync(
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

        state.global.content[link] = reply;

        accounts.add(reply.author);

        if (reply.parent_permlink === routeParams.permLink) {
            state.global.content[url].replies.push(link);
        }
    }
}

async function getStateForWitnesses(state, route, { api }) {
    const witnesses = await api.getWitnessesByVoteAsync('', 100);

    for (let witness of witnesses) {
        state.global.witnesses[witness.owner] = witness;
    }
}

async function getStateForApi(state, { params }, { routeParts, api, query }) {
    const args = { limit: 20, truncate_body: 1024 };

    let discussionsType;
    let discussionsKey = '';
    let tagsStr = '';

    // Home page
    if (params && params.category && params.username) {
        const { category, username } = params;
        const [account] = await api.getAccountsAsync([username]);
        if (!account) {
            return;
        }
        state.global.accounts[username] = account;

        args.select_authors = [username];
        discussionsType = category;
    } else {
        // decode tag for cyrillic symbols
        tagsStr = query.tags !== undefined ? decodeURIComponent(query.tags) : '';
        discussionsType = routeParts[0];
    }

    args.filter_tags = [...IGNORE_TAGS, ...IGNORE_TEST_TAGS];

    if (typeof tagsStr === 'string' && tagsStr.length) {
        const tags = tagsStr.split('|');
        const tagsSelect = tags[0] ? tags[0].split(',').sort() : [];
        const tagsFilter = tags[1] ? tags[1].split(',').sort() : [];

        let selectTags = [];
        if (tagsSelect && tagsSelect.length) {
            args.select_tags = selectTags = reverseTags(tagsSelect);
        }

        let filterTags = [];
        if (tagsFilter && tagsFilter.length) {
            args.filter_tags = filterTags = reverseTags(tagsFilter);
        } else {
            if (intersection(tagsSelect, IGNORE_TEST_TAGS).length) {
                args.filter_tags = IGNORE_TAGS;
            }
        }

        const selectedSelectTags = selectTags
            .filter(tag => !tag.startsWith('ru--'))
            .sort()
            .join(',');
        const selectedFilterTags = filterTags
            .filter(tag => !tag.startsWith('ru--'))
            .sort()
            .join(',');

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
        state.global.content[link] = discussion;
    }

    state.global.discussion_idx[discussionsKey] = discussion_idxes;
}

async function getStateForTags(state, params, { trendingTags }) {
    const tags = {};

    for (let tag of trendingTags) {
        tags[tag.name] = tag;
    }

    state.global.tags = tags;
}
