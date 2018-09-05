import {
    createDeepEqualSelector,
    dataSelector,
    globalSelector,
    routerParamSelector,
} from '../common';

export const currentPostSelector = createDeepEqualSelector(
    [globalSelector('content'), routerParamSelector('username'), routerParamSelector('slug')],
    (content, username, slug) => content.get(`${username}/${slug}`)
);

export const currentPostIsFavorite = createDeepEqualSelector(
    [dataSelector('favorites'), (state, props) => props.permLink],
    (favorites, permLink) => favorites.set.has(permLink)
);
