import { postSchema, formatContentId } from 'store/schemas/gate';
import { POSTS_FETCH_LIMIT } from 'shared/constants';
import {
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_ERROR,
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
} from 'store/constants/actionTypes';
import { entitySelector } from 'store/selectors/common';
import { currentUsernameUnsafeSelector } from 'store/selectors/auth';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPost = contentId => dispatch =>
  dispatch({
    [CALL_GATE]: {
      types: [FETCH_POST, FETCH_POST_SUCCESS, FETCH_POST_ERROR],
      method: 'content.getPost',
      params: contentId,
      schema: postSchema,
    },
    meta: contentId,
  });

export const fetchPostIfNeeded = contentId => (dispatch, getState) => {
  if (!entitySelector('posts', formatContentId(contentId))(getState())) {
    return dispatch(fetchPost(contentId));
  }
  return null;
};

export const fetchPosts = ({ type, id, sequenceKey }) => (dispatch, getState) => {
  const username = currentUsernameUnsafeSelector(getState());

  const newParams = {
    sortBy: 'timeDesc',
    limit: POSTS_FETCH_LIMIT,
    userId: username,
    sequenceKey: sequenceKey || null,
  };

  if (type === 'community') {
    newParams.type = 'community';
    newParams.communityId = id;
  } else if (type === 'user') {
    newParams.type = 'byUser';
    newParams.userId = id;
  } else {
    throw new Error('Invalid fetch posts type');
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getFeed',
      params: newParams,
      schema: {
        items: [postSchema],
      },
    },
    meta: newParams,
  });
};
