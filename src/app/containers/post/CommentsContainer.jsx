import React, { Component } from 'react';
import styled from 'styled-components';
import CommentsHeader from 'src/app/containers/post/CommentsHeader';
import CreateComment from 'src/app/containers/post/CreateComment';
import CommentsList from 'src/app/containers/post/CommentsList';
import { connect } from 'react-redux';
import { commentsContainerSelector } from 'src/app/redux/selectors/post/commentsContainerSelector';

const CommentsWrapper = styled.div`
    padding-top: 30px;
`;

@connect(commentsContainerSelector)
export default class CommentsContainer extends Component {
    render() {
        const { commentsCount, data } = this.props;
        return (
            <CommentsWrapper>
                <CommentsHeader commentsCount={commentsCount} />
                <CreateComment data={data}/>
                <CommentsList />
            </CommentsWrapper>
        );
    }
}
