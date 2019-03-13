import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { currentPostSelector } from 'src/app/redux/selectors/post/commonPost';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { PostContent } from 'src/containers/post/postContent/PostContent';

export default connect(
  createSelector(
    [currentPostSelector, currentUsernameSelector],
    (post, username) => ({
      isAuthor: username === post.author,
      author: post.author,
      tags: post.tags,
      category: post.category,
      payout: post.payout,
      data: post.data,
      title: post.title,
      body: post.body,
      pictures: post.pictures,
      created: post.created,
      permLink: post.permLink,
      url: post.url,
    })
  )
)(PostContent);
