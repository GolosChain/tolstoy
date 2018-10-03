import { api } from 'golos-js';
import g from 'app/redux/GlobalReducer';

import { DEFAULT_VOTE_LIMIT } from 'app/client_config';

export function setComments(postAuthor, postPermLink) {
    return dispatch => {
        api.getAllContentRepliesAsync(postAuthor, postPermLink, DEFAULT_VOTE_LIMIT).then(comments => {
            const permLink = `${postAuthor}/${postPermLink}`;
            dispatch(g.actions.setComments({ comments: comments, permLink }));
        });
    };
}
