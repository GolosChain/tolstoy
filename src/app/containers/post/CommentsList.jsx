import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';
import { fetchCommentsIfNeeded } from 'src/app/redux/actions/comments';
import commentsListSelector from 'src/app/redux/selectors/post/commentsList';

const CommentsListWrapper = styled.div``;

const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;

@connect(
    commentsListSelector,
    {
        fetchCommentsIfNeeded,
    }
)
export default class CommentsList extends Component {
    componentDidMount() {
        const { postAuthor, postPermLink, fetchCommentsIfNeeded } = this.props;
        fetchCommentsIfNeeded(postAuthor, postPermLink);
    }

    render() {
        const { username = '', comments, isFetching } = this.props;
        return (
            <CommentsListWrapper>
                {comments.map((comment, index) => {
                    const author = comment.get('author');
                    const permLink = comment.get('permlink');
                    return (
                        <CommentCardStyled
                            key={index}
                            permLink={`${author}/${permLink}`}
                            allowInlineReply={author !== username}
                            pageAccountName={author}
                        />
                    );
                })}
            </CommentsListWrapper>
        );
    }
}
