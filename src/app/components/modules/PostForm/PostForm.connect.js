import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { currentUsernameSelector, parseJSON } from 'src/app/redux/selectors/common';
import transaction from 'app/redux/Transaction';
import { showNotification } from 'src/app/redux/actions/ui';
import PostForm, { PAYOUT_TYPES } from './PostForm';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';

const editPostSelector = createSelector(
  [(state, props) => postSelector(state, `${props.author}/${props.permLink}`)],
  postData => {
    let payoutType;

    if (postData.get('max_accepted_payout').startsWith('0')) {
      payoutType = PAYOUT_TYPES.PAY_0;
    } else if (postData.get('percent_steem_dollars') === 0) {
      payoutType = PAYOUT_TYPES.PAY_100;
    } else {
      payoutType = PAYOUT_TYPES.PAY_50;
    }

    return {
      parentPermLink: postData.get('parent_permlink'),
      category: postData.get('category'),
      title: postData.get('title'),
      body: postData.get('body'),
      payoutType,
      curationPercent: postData.get('curation_rewards_percent'),
      jsonMetadata: parseJSON(postData.get('json_metadata')),
    };
  }
);

const selfVoteSelector = state => state.data.settings.getIn(['basic', 'selfVote']);

export default connect(
  (state, props) => {
    if (props.editMode) {
      return editPostSelector(state, props);
    } else {
      const chainProps = state.global.get('chain_properties');

      const addProps = {
        author: currentUsernameSelector(state),
        selfVote: selfVoteSelector(state),
      };

      if (chainProps) {
        addProps.minCurationPercent = chainProps.get('min_curation_percent');
        addProps.maxCurationPercent = chainProps.get('max_curation_percent');
      }

      return addProps;
    }
  },
  {
    onPost: (payload, onSuccess, onError) =>
      transaction.actions.broadcastOperation({
        type: 'comment',
        operation: payload,
        hideErrors: true,
        errorCallback: onError,
        successCallback: onSuccess,
      }),
    uploadImage: ({ file, progress }) => dispatch => {
      dispatch({
        type: 'user/UPLOAD_IMAGE',
        payload: {
          file,
          progress: data => {
            if (data && data.error) {
              dispatch(showNotification(data.error));
            }

            progress(data);
          },
        },
      });
    },
    fetchChainProperties: () => ({
      type: 'global/FETCH_CHAIN_PROPERTIES',
    }),
  }
)(PostForm);
