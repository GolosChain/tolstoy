import React, { Component } from 'react';
import { Link } from 'mocks/react-router';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import styled from 'styled-components';
import tt from 'counterpart';

import extractContent from 'utils/ExtractContent';

const WhoPostLink = styled(Link)`
  display: block;
  color: #333;
  white-space: nowrap;
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default class PostLink extends Component {
  static propTypes = {
    post: PropTypes.shape({
      author: PropTypes.string.isRequired,
      permLink: PropTypes.string.isRequired,
    }),
    getContent: PropTypes.func.isRequired,
    postsContent: PropTypes.instanceOf(Map),
  };

  isMounted = false;

  componentDidMount() {
    this.isMounted = true;
    this.fetchContent();
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  async fetchContent() {
    const { post, getContent, postsContent } = this.props;

    if (postsContent.get(`${post.author}/${post.permLink}`)) {
      return;
    }

    try {
      await getContent({ author: post.author, permlink: post.permLink });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { post, postsContent } = this.props;
    const fullPost = postsContent.get(`${post.author}/${post.permLink}`);
    return fullPost ? (
      <WhoPostLink to={fullPost.get('url')}>{renderRewardTrxTitle(fullPost)}</WhoPostLink>
    ) : null;
  }
}

function renderRewardTrxTitle(fullPost) {
  let title = fullPost.get('title');
  if (!title) {
    title = extractContent(fullPost).desc;
  }
  if (!title) {
    title = tt('g.mediafile');
  }
  return title;
}
