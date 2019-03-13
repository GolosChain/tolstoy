/* eslint-disable import/prefer-default-export */

import { commentSchema, profileCommentSchema } from 'store/schemas/gate';
import { FEED_PAGE_SIZE } from 'shared/constants';
import {
  FETCH_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_ERROR,
  FETCH_FEED_COMMENTS,
  FETCH_FEED_COMMENTS_SUCCESS,
  FETCH_FEED_COMMENTS_ERROR,
} from 'store/constants/actionTypes';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPostComments = ({ contentId, sequenceKey }) => async dispatch => {
  const newParams = {
    type: 'post',
    sortBy: 'time',
    limit: FEED_PAGE_SIZE,
    sequenceKey: sequenceKey || null,
    ...contentId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST_COMMENTS, FETCH_POST_COMMENTS_SUCCESS, FETCH_POST_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [commentSchema],
      },
    },
    meta: newParams,
  });
};

export const fetchUserComments = ({ userId, sequenceKey }) => dispatch => {
  const newParams = {
    type: 'user',
    sortBy: 'time',
    limit: FEED_PAGE_SIZE,
    sequenceKey: sequenceKey || null,
    userId,
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_FEED_COMMENTS, FETCH_FEED_COMMENTS_SUCCESS, FETCH_FEED_COMMENTS_ERROR],
      method: 'content.getComments',
      params: newParams,
      schema: {
        items: [profileCommentSchema],
      },
    },
    meta: newParams,
  });
};
