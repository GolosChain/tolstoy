import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentUsernameSelector, currentUserSelector } from 'app/redux/selectors/common';
import { locationTagsSelector } from 'app/redux/selectors/app/location';
import { currentPostSelector, authorSelector } from 'app/redux/selectors/post/commonPost';
import { PostContainer } from 'containers/post/PostContainer';
import { togglePin } from 'app/redux/actions/pinnedPosts';
import { toggleFavorite } from 'app/redux/actions/favorites';
import { recordPostView } from 'app/redux/actions/post';
import { isHide, isContainTags } from 'utils/StateFunctions';
import { HIDE_BY_TAGS } from 'constants/tags';

export default connect(
  createSelector(
    [
      currentPostSelector,
      authorSelector,
      currentUsernameSelector,
      currentUserSelector,
      locationTagsSelector,
    ],
    (post, author, username, user, { tagsSelect }) => {
      if (!post) {
        return {};
      }

      return {
        author: author.account,
        postLoaded: Boolean(post),
        isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
        permLink: post.permLink,
        isFavorite: post.isFavorite,
        isOwner: username === author.account,
        stats: post.stats,
        isHidden:
          isHide(post) ||
          post.isEmpty ||
          (username !== author.account && isContainTags(post, HIDE_BY_TAGS) && !tagsSelect.length),
        user,
      };
    }
  ),

  {
    togglePin,
    toggleFavorite,
    recordPostView,
  }
)(PostContainer);
