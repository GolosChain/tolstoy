import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

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
    position: relative;
    padding: 5px 10px 5px 5px;
    margin-top: -5px;
    color: #333333;
    cursor: pointer;
    
    ::after {
        content: ''; 
        position: absolute; 
        right: 0;
        top: 50%;
        transform: translateY(-20%);
        
        border: 3px solid transparent; 
        border-top: 4px solid #333333;
        
    }
`;

export default class CommentsHeader extends Component {
    static propTypes = {
        commentsCount: PropTypes.number.isRequired,
    };

    render() {
        const { commentsCount } = this.props;
        return (
            <CommentsHeaderWrapper>
                <CommentsCount>{tt('g.comments')} ({commentsCount})</CommentsCount>
                <SortComments>
                    {tt('post_jsx.sort_by')}:
                    <CommentCategory>{tt('post_jsx.popularity')}</CommentCategory>
                </SortComments>
            </CommentsHeaderWrapper>
        );
    }
}
