import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CommentCard from 'src/app/components/common/CommentCard/index';
import { getScrollElement } from 'src/app/helpers/window';

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

export class CommentsList extends Component {
    static propTypes = {
        isFetching: PropTypes.bool.isRequired,
        structuredComments: PropTypes.array.isRequired,
        saveListScrollPosition: PropTypes.func.isRequired,
    };

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    mapComments() {
        const { structuredComments } = this.props;
        if (!structuredComments.length) {
            return [];
        }
        return structuredComments.map((comment, index) => (
            <CommentWrapper key={index}>
                {comment.map((insetComment, index) => (
                    <CombinedComment
                        key={insetComment.authorAndPermLink}
                        permLink={insetComment.authorAndPermLink}
                        isPostPage={true}
                        onClick={this.onEntryClick}
                        insetDeep={insetComment.insetDeep}
                    />
                ))}
            </CommentWrapper>
        ));
    }

    render() {
        const { isFetching } = this.props;
        return <Wrapper>{this.mapComments()}</Wrapper>;
    }
}
