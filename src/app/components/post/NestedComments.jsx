import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { getScrollElement } from 'src/app/helpers/window';

import CommentCard from 'src/app/components/cards/CommentCard';
import CloseOpenButton from 'src/app/components/cards/CloseOpenButton';

const MAX_DEEP = 6;

const Wrapper = styled.div`
    position: relative;

    margin-top: 20px;

    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
`;

const Comment = styled(CommentCard)`
    border-radius: 0;
    box-shadow: none;

    margin-left: ${({ innerDeep }) => innerDeep * 20}px;
`;

const ToggleButton = styled(CloseOpenButton)`
    position: absolute;
    top: 13px;
    right: 18px;
    z-index: 2;

    width: 30px;
    height: 30px;

    ${is('collapsed')`
        top: 10px;
    `};
`;

export default class NestedComment extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        saveListScrollPosition: PropTypes.func.isRequired,
        updateComments: PropTypes.func.isRequired,
    };

    state = {
        collapsed: false,
    };

    nestedCommentRef = createRef();

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    toggleComment = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        this.nestedCommentRef.current.wrappedInstance.toggleComment();
    };

    renderReplies(comments, deep = 1) {
        if (comments.length === 0) {
            return null;
        }

        if (deep > MAX_DEEP) {
            deep = MAX_DEEP;
        }

        return comments.map(comment => (
            <Fragment key={comment.url}>
                <Comment
                    permLink={comment.url}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                    innerDeep={deep}
                    updateComments={this.props.updateComments}
                />
                {this.renderReplies(comment.replies, deep + 1)}
            </Fragment>
        ));
    }

    render() {
        const { comment, updateComments } = this.props;
        const { url, replies } = comment;
        const { collapsed } = this.state;

        return (
            <Wrapper>
                <ToggleButton collapsed={collapsed} toggleComment={this.toggleComment} />
                <Comment
                    permLink={url}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                    innerDeep={0}
                    innerRef={this.nestedCommentRef}
                    updateComments={updateComments}
                />
                {!collapsed && this.renderReplies(replies)}
            </Wrapper>
        );
    }
}
