import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { CardPost } from 'components/welcome/cardPost/CardPost';
import { toggleFavorite } from 'app/redux/actions/favorites';
import { togglePin } from 'app/redux/actions/pinnedPosts';
import { postSelector } from 'app/redux/selectors/post/commonPost';
import {
  currentUsernameSelector,
  dataSelector,
  globalSelector,
} from 'app/redux/selectors/common';
import { extractPinnedPosts } from 'app/redux/selectors/account/pinnedPosts';

const emptyMap = Map();

export default connect(
  createSelector(
    [
      (state, { post }) => postSelector(state, `${post.author}/${post.permlink}`),
      currentUsernameSelector,
      dataSelector('favorites'),
      globalSelector('accounts'),
    ],
    (post, username, favorites, accounts) => {
      const author = post.get('author');
      const permLink = post.get('permlink');
      const contentLink = `${author}/${permLink}`;
      const authorData = accounts.get(author) || emptyMap;
      const pinnedPostsUrls = extractPinnedPosts(authorData.get('json_metadata'));

      return {
        contentLink,
        isPinned: pinnedPostsUrls.includes(contentLink),
        isFavorite: favorites.set.includes(contentLink),
        isOwner: username === author,
      };
    }
  ),
  {
    toggleFavorite,
    togglePin,
  }
)(CardPost);
