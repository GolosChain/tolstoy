import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';
import { setPostComments } from 'src/app/redux/actions/receivePostComments';
import commentsListSelector from 'src/app/redux/selectors/post/commentsList';

const CommentsListWrapper = styled.div``;

const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;

@connect(
    commentsListSelector,
    {
        setPostComments,
    }
)
export default class CommentsList extends Component {
    componentDidMount() {
        const { postAuthor, postPermLink, setPostComments } = this.props;
        setPostComments(postAuthor, postPermLink);
    }

    render() {
        const { username = '', postCommentsArr = [] } = this.props;
        return (
            <CommentsListWrapper>
                {postCommentsArr.map((comment, index) => (
                    <CommentCardStyled
                        key={index}
                        permLink={`${comment.author}/${comment.permlink}`}
                        allowInlineReply={comment.author !== username}
                        pageAccountName={comment.author}
                    />
                ))}
            </CommentsListWrapper>
        );
    }
}
