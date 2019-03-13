import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Map } from 'immutable';

import { CardPost } from 'src/components/welcome/cardPost/CardPost';
import { toggleFavorite } from 'src/app/redux/actions/favorites';
import { togglePin } from 'src/app/redux/actions/pinnedPosts';
import { postSelector } from 'src/app/redux/selectors/post/commonPost';
import {
  currentUsernameSelector,
  dataSelector,
  globalSelector,
} from 'src/app/redux/selectors/common';
import { extractPinnedPosts } from 'src/app/redux/selectors/account/pinnedPosts';

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
