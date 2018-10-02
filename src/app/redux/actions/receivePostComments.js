import { api } from 'golos-js';

import { DEFAULT_VOTE_LIMIT } from 'app/client_config';

export async function receivePostComments(commentAuthor, commentPermLink) {
    return await api.getAllContentRepliesAsync(commentAuthor, commentPermLink, DEFAULT_VOTE_LIMIT);
}
