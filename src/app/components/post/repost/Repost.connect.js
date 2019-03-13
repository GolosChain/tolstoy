import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { openRepostDialog } from 'src/app/redux/actions/dialogs';
import { authorSelector } from 'src/app/redux/selectors/post/commonPost';
import { Repost } from 'src/app/components/post/repost/Repost';

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
