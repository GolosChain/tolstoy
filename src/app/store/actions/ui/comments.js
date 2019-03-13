/* eslint-disable import/prefer-default-export */

import { SET_COMMENTS_FILTER } from 'store/constants/actionTypes';

export function setCommentsFilter(filter) {
  return {
    type: SET_COMMENTS_FILTER,
    payload: { filter },
  };
}
