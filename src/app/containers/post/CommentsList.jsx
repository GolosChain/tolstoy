import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';
import { setComments } from 'src/app/redux/actions/receiveComments';
import commentsListSelector from 'src/app/redux/selectors/post/commentsList';

const CommentsListWrapper = styled.div``;

const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;

@connect(
    commentsListSelector,
    {
        setComments,
    }
)
export default class CommentsList extends Component {
    componentDidMount() {
        const { postAuthor, postPermLink, setComments } = this.props;
        setComments(postAuthor, postPermLink);
    }

    render() {
        const { username = '', comments = [] } = this.props;
        return (
            <CommentsListWrapper>
                {comments.map((comment, index) => (
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
