import { connect } from 'react-redux';

import { repost } from 'src/app/redux/actions/repost';
import { showNotification } from 'src/app/redux/actions/ui';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { sanitizeCardPostData } from 'src/app/redux/selectors/post/commonPost';
import RepostDialog from './RepostDialog';

export default connect(
  (state, props) => {
    const post = state.global.getIn(['content', props.postLink]);

    return {
      myAccountName: currentUsernameSelector(state),
      sanitizedPost: sanitizeCardPostData(post),
    };
  },
  {
    repost,
    showNotification,
  },
  null,
  { withRef: true }
)(RepostDialog);
