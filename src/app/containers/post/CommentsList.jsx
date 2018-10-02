import React, { Component } from 'react';
import { api } from 'golos-js';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';
import { DEFAULT_VOTE_LIMIT } from 'app/client_config';

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
        this.receivePostComments().then(comments => {
            this.setState({ commentsArr: comments });
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

    receivePostComments = async () => {
        const { commentAuthor, commentPermLink } = this.props;
        return await api.getAllContentRepliesAsync(
            commentAuthor,
            commentPermLink,
            DEFAULT_VOTE_LIMIT
        );
    };
}
