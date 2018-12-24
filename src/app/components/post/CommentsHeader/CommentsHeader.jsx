import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Popover from 'golos-ui/Popover';
import { logClickAnalytics } from 'src/app/helpers/gaLogs';
import SortLine from 'src/app/components/post/CommentsHeader/SortLine';

const SORT_CATEGORIES = ['popularity', 'voices', 'first_new', 'first_old'];

const CommentsHeaderWrapper = styled.div`
    display: flex;
    height: 32px;
    justify-content: space-between;

    @media (max-width: 500px) {
        height: 48px;
    }
`;

const CommentsCount = styled.div`
    display: flex;
    align-items: center;
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
    display: flex;
    align-items: center;
    padding: 0 10px 0 5px;
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
    display: flex;
    align-items: center;

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
    padding: 4px 0;
    margin: 0;
    flex-direction: column;
`;

export default class CommentsHeader extends Component {
    static propTypes = {
        commentsCount: PropTypes.number.isRequired,
    };

    state = {
        showPopover: false,
        sortCategory: 'first_old',
    };

    closePopover = e => {
        if (e) {
            e.stopPropagation();
        }

        this.setState({
            showPopover: false,
        });

        this.lastCloseTs = Date.now();
    };

    openPopover = () => {
        // Unexpected reopen popup protection
        if (this.lastCloseTs && Date.now() - this.lastCloseTs < 250) {
            return;
        }

        this.setState({
            showPopover: true,
        });
    };

    onSortCategoryChange = sortCategory => {
        this.closePopover();

        logClickAnalytics('Link', `Sort by ${sortCategory}`);
        this.setState({ sortCategory });
    };

    render() {
        const { commentsCount } = this.props;
        const { showPopover, sortCategory } = this.state;

        return (
            <CommentsHeaderWrapper>
                <CommentsCount id="comments">
                    {tt('g.comments')} ({commentsCount})
                </CommentsCount>
                <SortComments>
                    <SortBy>{tt('post_jsx.sort_by')}:</SortBy>
                    <CommentCategory onClick={this.openPopover}>
                        {tt(['post_jsx', sortCategory])}
                        {showPopover ? (
                            <CustomPopover show withArrow={false} closePopover={this.closePopover}>
                                <SortWrapper>
                                    {SORT_CATEGORIES.map(sortCategory => (
                                        <SortLine
                                            key={sortCategory}
                                            sortCategory={sortCategory}
                                            onChange={this.onSortCategoryChange}
                                        />
                                    ))}
                                </SortWrapper>
                            </CustomPopover>
                        ) : null}
                    </CommentCategory>
                </SortComments>
            </CommentsHeaderWrapper>
        );
    }
}
