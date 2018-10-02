import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';
import { receivePostComments } from 'src/app/redux/actions/receivePostComments';

const CommentsListWrapper = styled.div``;

const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;

export default class CommentsList extends Component {
    static propTypes = {
        commentAuthor: PropTypes.string.isRequired,
        commentPermLink: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    };

    state = {
        commentsArr: [],
    };

    componentDidMount() {
        const { commentAuthor, commentPermLink } = this.props;
        receivePostComments(commentAuthor, commentPermLink).then(comments => {
            this.setState({ commentsArr: comments }); //TODO move data to store
        });
    }

    render() {
        const { commentsArr } = this.state;
        const { username } = this.props;
        return (
            <CommentsListWrapper>
                {commentsArr.map((comment, index) => (
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
