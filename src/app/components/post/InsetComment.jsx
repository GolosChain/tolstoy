import React, { Component, Fragment, createRef } from 'react';
import styled from 'styled-components';
import { isNot } from 'styled-is';

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

    margin-left: ${props => props.insetDeep * 20}px;
`;

const ToggleButton = styled(CloseOpenButton)`
    position: absolute;
    top: 13px;
    right: 18px;
    z-index: 2;

    width: 30px;
    height: 30px;

    ${isNot('isCommentOpen')`
        top: 10px;
    `};
`;

export default class InsetComment extends Component {
    state = {
        isCommentOpen: true,
    };

    combCommentRef = createRef();

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    toggleComment = () => {
        this.setState({
            isCommentOpen: !this.state.isCommentOpen,
        });
        this.combCommentRef.current.toggleComment();
    };

    renderReplies(comment) {
        return comment.map((insetComment, index) => (
            <Fragment key={insetComment.authorAndPermLink}>
                <Comment
                    permLink={insetComment.authorAndPermLink}
                    isPostPage={true}
                    onClick={this.onEntryClick}
                    insetDeep={insetComment.insetDeep}
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
                    insetDeep={comment[0].insetDeep}
                    combCommentRef={this.combCommentRef}
                />
                {isCommentOpen && this.renderReplies(comment.slice(1))}
            </Wrapper>
        );
    }
}
