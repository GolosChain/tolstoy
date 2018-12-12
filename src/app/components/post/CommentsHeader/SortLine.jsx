import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

const Wrapper = styled(Link)`
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

export default class SortLine extends Component {
    static propTypes = {
        changeSortCategory: PropTypes.func.isRequired,
        sortCategory: PropTypes.string.isRequired,
    };

    linkClick = () => {
        const { sortCategory, changeSortCategory } = this.props;
        changeSortCategory(sortCategory);
    };

    urlSortParam() {
        const { sortCategory } = this.props;
        switch (sortCategory) {
            case 'popularity':
                return 'trending';
            case 'voices':
                return 'votes';
            case 'first_new':
                return 'new';
            case 'first_old':
                return 'old';
        }
    }

    render() {
        const { sortCategory } = this.props;
        const urlWithSortParam = `${window.location.pathname}?sort=${this.urlSortParam()}#comments`;

        return (
            <Wrapper to={urlWithSortParam} onClick={this.linkClick}>
                {tt(`post_jsx.${sortCategory}`)}
            </Wrapper>
        );
    }
}
