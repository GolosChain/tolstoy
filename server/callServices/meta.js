import config from 'config';

import { callApi } from './helpers';

const url = config.get('meta_service_url');

export async function getPostsViewCount(postLinks) {
    return (await callApi(url, 'getPostsViewCount', { postLinks })).results;
}
