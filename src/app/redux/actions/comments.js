import { api } from 'golos-js';

import { DEFAULT_VOTE_LIMIT } from 'app/client_config';
import {
    FETCH_COMMENTS,
    FETCH_COMMENTS_ERROR,
    FETCH_COMMENTS_SUCCESS,
} from 'src/app/redux/constants/comments';
import { dataSelector } from 'src/app/redux/selectors/common';

function fetchComments(postAuthor, postPermLink) {
    return dispatch => {
        dispatch({
            type: FETCH_COMMENTS,
        });
        api.getAllContentRepliesAsync(postAuthor, postPermLink, DEFAULT_VOTE_LIMIT)
            .then(comments => {
                const permLink = `${postAuthor}/${postPermLink}`;
                dispatch({
                    type: FETCH_COMMENTS_SUCCESS,
                    permLink,
                    comments,
                });
            })
            .catch(error => {
                dispatch({
                    type: FETCH_COMMENTS_ERROR,
                    error,
                });
                dispatch({
                    type: 'ADD_NOTIFICATION',
                    payload: {
                        message: error,
                        dismissAfter: 5000,
                    },
                });
            });
    };
}

export function fetchCommentsIfNeeded(postAuthor, postPermLink) {
    return (dispatch, getState) => {
        if (!dataSelector(['comments', `${postAuthor}/${postPermLink}`])(getState())) {
            return dispatch(fetchComments(postAuthor, postPermLink));
        }
    };
}
