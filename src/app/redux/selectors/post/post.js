import {
    createDeepEqualSelector,
    dataSelector,
    globalSelector,
    routerParamSelector,
} from '../common';
import { parsePayoutAmount } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';

export const currentPostIsFavoriteSelector = createDeepEqualSelector(
    [dataSelector('favorites'), (state, props) => props.permLink],
    (favorites, permLink) => favorites.set.includes(permLink)
);

export const currentPostSelector = createDeepEqualSelector(
    [
        globalSelector('content'),
        routerParamSelector('username'),
        routerParamSelector('slug'),
        currentPostIsFavoriteSelector,
    ],
    (content, username, slug, isFavorite) => {
        const post = content.get(`${username}/${slug}`);
        return {
            created: post.get('created'),
            isFavorite: isFavorite,
            tags: JSON.parse(post.get('json_metadata')).tags,
            payout:
                parsePayoutAmount(post.get('pending_payout_value')) +
                parsePayoutAmount(post.get('total_payout_value')),
            category: post.get('category'),
            title: post.get('title'),
            body: post.get('body'),
            jsonMetadata: post.get('json_metadata'),
            pictures: post.getIn(['stats', 'pictures']),
            author: post.get('author'),
            permlink: post.get('permlink'),
            children: post.get('children'),
            link: `/@${post.get('author')}/${post.get('permlink')}`,
            data: post,
        };
    }
);

export const authorSelector = createDeepEqualSelector(
    [globalSelector('accounts'), currentPostSelector],
    (accounts, post) => {
        const account = accounts.get(post.author);
        const jsonData = normalizeProfile({
            json_metadata: account.get('json_metadata'),
            name: post.author,
        });
        return {
            name: jsonData.name || post.author,
            account: post.author,
            about: jsonData.about,
            isFollow: true,
            followerCount: 0,
            pinnedPosts: [
                {
                    title:
                        'Test pinked post.Test pinked post.Test pinked post.Test pinked post.Test pinked post.',
                    url:
                        '/vox-populi/@istfak/ru-obzor-tega-istoriya-2608-809-istfak-vsem-spasibo-prodolzhaem-rabotu',
                },
            ],
        };
    }
);

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
        count: false,
    },
    {
        iconName: 'star',
        count: false,
    },
]);
