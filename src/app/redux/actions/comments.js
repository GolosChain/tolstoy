import { api } from 'golos-js';

import { DEFAULT_VOTE_LIMIT } from 'app/client_config';
import { COMMENTS_SET_COMMENTS } from 'src/app/redux/constants/comments';

export function setComments(postAuthor, postPermLink) {
    return dispatch => {
        api.getAllContentRepliesAsync(postAuthor, postPermLink, DEFAULT_VOTE_LIMIT).then(
            comments => {
                const permLink = `${postAuthor}/${postPermLink}`;
                dispatch({
                    type: COMMENTS_SET_COMMENTS,
                    permLink,
                    comments,
                });
            }
        );
    };
}
