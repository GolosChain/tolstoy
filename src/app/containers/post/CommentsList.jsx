import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/CommentCard';

const CommentsListWrapper = styled.div``;

const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;

export default class CommentsList extends Component {
    static propTypes = {
        username: PropTypes.string.isRequired,
        isFetching: PropTypes.bool.isRequired,
        comments: PropTypes.instanceOf(List),
    };

    render() {
        const { username, isFetching, comments } = this.props;
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
