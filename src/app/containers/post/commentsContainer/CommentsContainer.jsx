import React, { Component } from 'react';
import styled from 'styled-components';

import CommentsHeader from 'src/app/components/post/CommentsHeader';
import CreateComment from 'src/app/components/post/CreateComment';
import CommentsList from 'src/app/components/post/CommentsList';

const CommentsWrapper = styled.div`
    padding-top: 30px;
`;

export class CommentsContainer extends Component {
    componentDidMount() {
        this.updateComments();
    }

    updateComments = () => {
        const { postAuthor, postPermLink, fetchCommentsIfNeeded } = this.props;
        fetchCommentsIfNeeded(postAuthor, postPermLink);
    };

    render() {
        const { commentsCount, data, username = '', comments, isFetching } = this.props;
        return (
            <CommentsWrapper>
                <CommentsHeader commentsCount={commentsCount} />
                <CreateComment data={data} updateComments={this.updateComments} />
                <CommentsList username={username} comments={comments} isFetching={isFetching} />
            </CommentsWrapper>
        );
    }
}
