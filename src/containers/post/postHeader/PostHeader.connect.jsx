import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';
import { currentUsernameSelector } from 'app/redux/selectors/common';
import { followingSelector } from 'app/redux/selectors/follow/follow';
import { updateFollow } from 'app/redux/actions/follow';
import { PostHeader } from 'containers/post/postHeader/PostHeader';
import { confirmUnfollowDialog } from 'app/redux/actions/dialogs';

export default connect(
  createSelector(
    [
      currentPostSelector,
      authorSelector,
      currentUsernameSelector,
      followingSelector('blog_result'),
    ],
    (post, author, username, follow) => ({
      username,
      created: post.created,
      isFavorite: post.isFavorite,
      category: post.category,
      isPromoted: post.promotedAmount > 0,
      author: author.account,
      isFollow: follow.includes(author.account),
      permLink: post.permLink,
      isOwner: username === author.account,
      isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
    })
  ),
  {
    updateFollow,
    confirmUnfollowDialog,
  },
  null,
  { withRef: true }
)(PostHeader);