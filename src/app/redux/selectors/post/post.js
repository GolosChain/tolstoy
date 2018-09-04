import { createDeepEqualSelector, globalSelector, routerParamSelector } from '../common';

export const currentPostSelector = createDeepEqualSelector(
    [globalSelector('content'), routerParamSelector('username'), routerParamSelector('slug')],
    (content, username, slug) => content.get(`${username}/${slug}`)
);
