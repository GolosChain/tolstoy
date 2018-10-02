import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import CommentsHeader from 'src/app/containers/post/CommentsHeader';
import CreateComment from 'src/app/containers/post/CreateComment';
import CommentsList from 'src/app/containers/post/CommentsList';
import commentsContainerSelector from 'src/app/redux/selectors/post/commentsContainerSelector';

const CommentsWrapper = styled.div`
    padding-top: 30px;
`;

@connect(commentsContainerSelector)
export default class CommentsContainer extends Component {
    render() {
        const { commentsCount, commentAuthor, commentPermLink, username = '', data } = this.props;
        return (
            <CommentsWrapper>
                <CommentsHeader commentsCount={commentsCount} />
                <CreateComment data={data} />
                <CommentsList
                    commentAuthor={commentAuthor}
                    commentPermLink={commentPermLink}
                    username={username}
                />
            </CommentsWrapper>
        );
    }
}
