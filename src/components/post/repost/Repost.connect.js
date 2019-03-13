import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'app/redux/selectors/common';
import { openRepostDialog } from 'app/redux/actions/dialogs';
import { authorSelector } from 'app/redux/selectors/post/commonPost';
import { Repost } from 'components/post/repost/Repost';

export default connect(
  createSelector(
    [authorSelector, currentUsernameSelector],
    (author, username) => {
      return {
        isOwner: username === author.account,
      };
    }
  ),
  {
    openRepostDialog,
  }
)(Repost);
