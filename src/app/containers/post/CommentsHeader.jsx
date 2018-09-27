import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const CommentsHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CommentsCount = styled.div`
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #393636;
    text-transform: uppercase;
`;

const SortComments = styled.div`
    display: flex;
    
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #b7b7ba;
`;

const CommentCategory = styled.div`
    color: #333333;
`;

export default class CommentsHeader extends Component {
    static propTypes = {
        commentsCount: PropTypes.number.isRequired,
    };

    render() {
        const { commentsCount } = this.props;
        return (
            <CommentsHeaderWrapper>
                <CommentsCount>комментарии ({commentsCount})</CommentsCount>
                <SortComments>
                    Сортировать по:
                    <CommentCategory>Популярности</CommentCategory>
                </SortComments>
            </CommentsHeaderWrapper>
        );
    }
}
