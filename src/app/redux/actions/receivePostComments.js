import { api } from 'golos-js';
import g from 'app/redux/GlobalReducer';

import { DEFAULT_VOTE_LIMIT } from 'app/client_config';

export function setPostComments(postAuthor, postPermLink) {
    return dispatch => {
        api.getAllContentRepliesAsync(postAuthor, postPermLink, DEFAULT_VOTE_LIMIT).then(comments => {
            const permLink = `${postAuthor}/${postPermLink}`;
            dispatch(g.actions.setPostComments({ postCommentsArr: comments, permLink }));
        });
    };
}
