import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CommentsHeader from 'src/app/containers/post/CommentsHeader';
import CreateComment from 'src/app/containers/post/CreateComment';
import CommentsTape from 'src/app/containers/post/CommentsTape';
import { commentsContainerSelector } from 'src/app/redux/selectors/post/commentsContainer';

const CommentsWrapper = styled.div`
    padding-top: 30px;
`;

@connect(commentsContainerSelector)
export default class CommentsContainer extends Component {
    render() {
        return (
            <CommentsWrapper>
                <CommentsHeader />
                <CreateComment />
                <CommentsTape />
            </CommentsWrapper>
        );
    }
}
