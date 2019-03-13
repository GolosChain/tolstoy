import {
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
  VOTE_POST,
  VOTE_POST_SUCCESS,
  VOTE_POST_ERROR,
} from 'store/constants/actionTypes';
import { COMMUN_API } from 'store/middlewares/commun-api';
import { currentUsernameSelector } from 'store/selectors/auth';

import { defaults } from 'utils/common';

// eslint-disable-next-line import/prefer-default-export
export const createmssg = data => async (dispatch, getState) => {
  const accountName = currentUsernameSelector(getState());

  if (!accountName) {
    throw new Error('Unauthorized');
  }

  const fullData = defaults(data, {
    message_id: {
      author: '',
      permlink: '',
    },
    parent_id: {
      author: '',
      permlink: '',
      ref_block_num: 0,
    },
    beneficiaries: [],
    tokenprop: 0,
    vestpayment: true,
    headermssg: '',
    bodymssg: '',
    languagemssg: '',
    tags: [],
    jsonmetadata: '',
  });

  fullData.message_id.author = accountName;

  return dispatch({
    [COMMUN_API]: {
      types: [CREATE_POST, CREATE_POST_SUCCESS, CREATE_POST_ERROR],
      contract: 'publish',
      method: 'createmssg',
      params: fullData,
    },
    meta: fullData,
  });
};

export const vote = data => async (dispatch, getState) => {
  const accountName = currentUsernameSelector(getState());

  if (!accountName) {
    throw new Error('Unauthorized');
  }

  const fullData = defaults(data, {
    voter: '',
    message_id: null,
    weight: 0,
  });

  fullData.voter = accountName;

  const { weight } = fullData;
  let methodName;

  if (weight === 0) {
    methodName = 'unvote';
    delete fullData.weight;
  } else if (weight < 0) {
    methodName = 'downvote';
    fullData.weight = Math.abs(weight);
  } else {
    methodName = 'upvote';
  }

  return dispatch({
    [COMMUN_API]: {
      types: [VOTE_POST, VOTE_POST_SUCCESS, VOTE_POST_ERROR],
      contract: 'publish',
      method: methodName,
      params: fullData,
    },
    meta: fullData,
  });
};
