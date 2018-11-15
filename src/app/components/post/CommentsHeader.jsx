import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Popover from 'golos-ui/Popover';

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

    &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-20%);

        border: 3px solid transparent;
        border-top: 4px solid #333333;
    }
`;

const SortBy = styled.div`
    @media (max-width: 576px) {
        display: none;
    }
`;

const CustomPopover = styled(Popover)`
    margin: -5px 0 0 -27px;
`;

const SortWrapper = styled.div`
    display: flex;
    width: 170px;
    padding: 0;
    margin: 0;
    flex-direction: column;
`;

const SortLine = styled(Link)`
    display: block;
    padding: 11px 16px;
    color: #333333;

    &:hover {
        background-color: #f0f0f0;
    }

    &:active,
    &:hover,
    &:focus {
        color: #333333;
    }
`;

export default class CommentsHeader extends Component {
    static propTypes = {
        commentsCount: PropTypes.number.isRequired,
        pathname: PropTypes.string.isRequired,
    };

    state = {
        showPopover: false,
        sortCategory: tt('post_jsx.popularity'),
    };

    closePopover = e => {
        if (e) {
            e.stopPropagation();
        }

        this.setState({
            showPopover: false,
        });
    };

    openPopover = () => {
        this.setState({
            showPopover: true,
        });
    };

    changeSortCategory = (category) => {
        this.setState({sortCategory: tt(`post_jsx.${category}`)});
    };

    render() {
        const { showPopover, sortCategory } = this.state;
        const { commentsCount, pathname } = this.props;

        return (
            <CommentsHeaderWrapper>
                <CommentsCount id="comments">
                    {tt('g.comments')} ({commentsCount})
                </CommentsCount>
                <SortComments>
                    <SortBy>{tt('post_jsx.sort_by')}:</SortBy>
                    <CommentCategory onClick={this.openPopover}>
                        {sortCategory}
                        {showPopover ? (
                            <CustomPopover show onClose={this.closePopover} withArrow={false}>
                                <SortWrapper onClick={this.closePopover}>
                                    <SortLine to={`${pathname}?sort=trending#comments`}
                                              onClick={() => this.changeSortCategory('popularity')}>
                                        {tt('post_jsx.popularity')}
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=votes#comments`}
                                              onClick={() => this.changeSortCategory('voices')}>
                                        {tt('post_jsx.voices')}
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=new#comments`}
                                              onClick={() => this.changeSortCategory('first_new')}>
                                        {tt('post_jsx.first_new')}
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=old#comments`}
                                              onClick={() => this.changeSortCategory('first_old')}>
                                        {tt('post_jsx.first_old')}
                                    </SortLine>
                                </SortWrapper>
                            </CustomPopover>
                        ) : null}
                    </CommentCategory>
                </SortComments>
            </CommentsHeaderWrapper>
        );
    }
}
