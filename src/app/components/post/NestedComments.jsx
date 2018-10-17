import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { getScrollElement } from 'src/app/helpers/window';

import CommentCard from 'src/app/components/common/CommentCard/index';
import { CloseOpenButton } from 'src/app/components/common/CommentCard/CloseOpenButton';

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

    margin-left: ${props => props.innerDeep * 20}px;
`;

const ToggleButton = styled(CloseOpenButton)`
    position: absolute;
    top: 10px;
    right: 18px;
    z-index: 2;

    width: 30px;
    height: 30px;

    ${is('isCommentOpen')`
        top: 13px;
    `};
`;

export default class NestedComment extends Component {
    static propTypes = {
        comment: PropTypes.array.isRequired,
        saveListScrollPosition: PropTypes.func.isRequired,
    };

    state = {
        isCommentOpen: true,
    };

    nestedCommentRef = createRef();

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    toggleComment = () => {
        this.setState({
            isCommentOpen: !this.state.isCommentOpen,
        });
        this.nestedCommentRef.current.wrappedInstance.toggleComment();
    };

    renderReplies(comment) {
        return comment.map((nestedComment, index) => (
            <Fragment key={nestedComment.authorAndPermLink}>
                <Comment
                    permLink={nestedComment.authorAndPermLink}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                    innerDeep={nestedComment.innerDeep}
                />
            </Fragment>
        ));
    }

    render() {
        const { isCommentOpen } = this.state;
        const { comment } = this.props;

        return (
            <Wrapper>
                <ToggleButton isCommentOpen={isCommentOpen} toggleComment={this.toggleComment} />
                <Comment
                    permLink={comment[0].authorAndPermLink}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                    innerDeep={comment[0].innerDeep}
                    innerRef={this.nestedCommentRef}
                />
                {isCommentOpen && this.renderReplies(comment.slice(1))}
            </Wrapper>
        );
    }
}
