import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard';
import { getScrollElement } from 'src/app/helpers/window';

const INSET_COMMENTS_LEVELS_NUMBER = 6;

const Wrapper = styled.div``;

const CombinedComment = styled(CommentCard)`
    border-radius: 0;
    box-shadow: none;

    margin-left: ${props => props.insetDeep * 20}px;
`;

const CommentWrapper = styled.div`
    margin-top: 20px;

    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
`;

export default class CommentsList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        comments: PropTypes.instanceOf(List),
        saveListScrollPosition: PropTypes.func.isRequired,
        postPermLink: PropTypes.string,
    };

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    mapComments() {
        const { comments, postPermLink } = this.props;
        const commentsComponents = [];
        const commentsCopy = [...comments.toJS()];
        for (let i = 0; i < commentsCopy.length; i++) {
            const currentComment = commentsCopy[i];

            if (!currentComment || postPermLink !== currentComment.parent_permlink) {
                continue;
            }

            commentsCopy[i] = null;

            commentsComponents.push(
                <CommentWrapper key={i}>{this.findReplies(commentsCopy, currentComment)}</CommentWrapper>
            );
        }
        return commentsComponents;
    }

    findReplies(comments, currentComment, insetDeep = 0) {
        const commentWithChildren = [];

        commentWithChildren.push(
            <CombinedComment
                key={currentComment.permlink}
                permLink={`${currentComment.author}/${currentComment.permlink}`}
                isPostPage={true}
                onClick={this.onEntryClick}
                insetDeep={insetDeep}
            />
        );

        const replies = currentComment.replies;

        if (replies.length) {
            replies.forEach(reply => {
                let comment = this.getComment(comments, reply);
                if (insetDeep < INSET_COMMENTS_LEVELS_NUMBER) {
                    ++insetDeep;
                }
                const insetReplies = this.findReplies(comments, comment, insetDeep);
                commentWithChildren.push(...insetReplies);
            });
        }

        return commentWithChildren;
    }

    getComment(comments, link) {
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            if (comment === null) {
                continue;
            }
            if (`${comment.author}/${comment.permlink}` === link) {
                comments[i] = null;
                return comment;
            }
        }
    }

    render() {
        const { isFetching } = this.props;
        return <Wrapper>{this.mapComments()}</Wrapper>;
    }
}
