import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is, { isOr } from 'styled-is';
import { Link } from 'react-router';

export const Tag = styled.div`
    position: relative;
    line-height: 12px;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-overflow: ellipsis;
    text-align: center;
    white-space: nowrap;
    color: #757575;
    border: solid 1px #e1e1e1;
    background-color: #ffffff;
    transition: border-color 0.15s ease;

    &:not(last-child) {
        margin-right: 10px;
    }

    &:hover {
        border-color: #2879ff;
    }

    ${is('filtered')`
        color: ##757575;
        background-color: #ececec;
        border-color: #ececec;

        &:hover {
            color: ##757575;
            background-color: #ddd;
            border-color: #ddd;
        }
    `};

    ${isOr('selected', 'category')`
        color: #2879ff;
        border-color: #cde0ff;

        &:hover {
            color: #2879ff;
            border-color: #2879ff;
        }
    `};
`;

Tag.propTypes = {
    category: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

Tag.defaultProps = {
    category: 0,
};

export const TagLink = Tag.withComponent(({ category, ...otherProps }) => <Link {...otherProps} />);
export default Tag;
