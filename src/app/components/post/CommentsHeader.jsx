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

const CustomPopover = styled(Popover)``;

const SortWrapper = styled.div`
    display: flex;
    width: 200px;
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
    };

    closePopover = () => {
        this.setState({
            showPopover: false,
        });
    };

    openPopover = () => {
        this.setState({
            showPopover: true,
        });
    };

    render() {
        const { commentsCount, pathname } = this.props;
        const { showPopover } = this.state;
        return (
            <CommentsHeaderWrapper>
                <CommentsCount>
                    {tt('g.comments')} ({commentsCount})
                </CommentsCount>
                <SortComments>
                    <SortBy>{tt('post_jsx.sort_by')}:</SortBy>
                    <CommentCategory onClick={this.openPopover}>
                        {tt('post_jsx.popularity')}
                        {showPopover ? (
                            <CustomPopover show onClose={this.closePopover} withArrow={false}>
                                <SortWrapper>
                                    <SortLine to={`${pathname}?sort=trending#comments`}>
                                        {tt('post_jsx.popularity')}
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=votes#comments`}>
                                        Голоса
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=new#comments`}>
                                        Сначала новые
                                    </SortLine>
                                    <SortLine to={`${pathname}?sort=old#comments`}>
                                        Сначала старые
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
