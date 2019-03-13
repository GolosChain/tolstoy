/* eslint-disable import/prefer-default-export */

import { SET_POST_VOTE, SET_COMMENT_VOTE } from 'store/constants';
import { vote as communVote } from 'store/actions/commun/publish';
import { formatContentId } from 'store/schemas/gate';

export const vote = ({ contentId, type, weight }) => async dispatch => {
  const voteResult = await dispatch(
    communVote({
      message_id: {
        author: contentId.userId,
        ref_block_num: contentId.refBlockNum,
        permlink: contentId.permlink,
      },
      weight,
    })
  );

  const actionType = type === 'post' ? SET_POST_VOTE : SET_COMMENT_VOTE;

  dispatch({
    type: actionType,
    payload: {
      id: formatContentId(contentId),
      votes: {
        hasUpVote: weight > 0,
        hasDownVote: weight < 0,
      },
    },
  });

  return voteResult;
};
