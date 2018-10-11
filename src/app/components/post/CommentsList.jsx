import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard';
import { getScrollElement } from 'src/app/helpers/window';

const Wrapper = styled.div``;

/*const CommentCardStyled = styled(CommentCard)`
    margin-top: 20px;
`;*/

const CombinedComment = styled(CommentCard)`
    border-radius: 0;
    box-shadow: none;
`;

const CommentsWrapper = styled.div`
    margin-top: 20px;

    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
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

    findReplies(comments, currentComment, deep = 0) {
        const commentWithChildren = [];

        const author = currentComment.get('author');
        const permLink = currentComment.get('permlink');

        commentWithChildren.push(
            <CombinedComment
                permLink={`${author}/${permLink}`}
                isPostPage={true}
                onClick={this.onEntryClick}
            />
        );

        const replies = currentComment.get('replies');

        replies.forEach(reply => {
            commentWithChildren.push(
                <CombinedComment
                    permLink={reply}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                />
            )
        });

        /*if (replies.get(0)) {
            commentWithChildren.push(
                    {replies.map(reply => (
                        <CombinedComment
                            permLink={reply}
                            isPostPage={true}
                            onClick={this.onEntryClick}
                        />
                    ))}
            );
        } else {
            commentWithChildren.push(
                <CombinedComment
                    permLink={`${author}/${permLink}`}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                />
            );
        }*/
    }

    mapComments() {
        const { comments, postPermLink } = this.props;
        const commentsComponents = [];
        const commentsCopy = [...comments];
        for (let i = 0; i < commentsCopy.length; i++) {
            const currentComment = commentsCopy[i];

            if (postPermLink !== currentComment.get('parent_permlink')) {
                continue;
            }

            commentsComponents.push(
                <CommentsWrapper>
                    {this.findReplies(commentsCopy, currentComment)}
                </CommentsWrapper>
            );
        }
        return commentsComponents;
    }

    render() {
        const { isFetching } = this.props;
        return <Wrapper>{this.mapComments()}</Wrapper>;
    }
}
