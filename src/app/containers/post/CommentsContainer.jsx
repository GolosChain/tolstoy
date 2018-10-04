import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import CommentsHeader from 'src/app/containers/post/CommentsHeader';
import CreateComment from 'src/app/containers/post/CreateComment';
import CommentsList from 'src/app/containers/post/CommentsList';
import commentsContainerSelector from 'src/app/redux/selectors/post/commentsContainer';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';

const CommentsWrapper = styled.div`
    padding-top: 30px;
`;

@connect(
    commentsContainerSelector,
    {
        fetchCommentsIfNeeded,
    }
)
export default class CommentsContainer extends Component {
    componentDidMount() {
        const { postAuthor, postPermLink, fetchCommentsIfNeeded } = this.props;
        fetchCommentsIfNeeded(postAuthor, postPermLink);
    }

    render() {
        const { commentsCount, data, username = '', comments, isFetching } = this.props;
        return (
            <CommentsWrapper>
                <CommentsHeader commentsCount={commentsCount} />
                <CreateComment data={data} />
                <CommentsList username={username} comments={comments} isFetching={isFetching} />
            </CommentsWrapper>
        );
    }
}
