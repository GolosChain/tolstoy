import styled from 'styled-components';
import PropTypes from 'prop-types';
import is, { isOr } from 'styled-is';
import { Link } from 'react-router';

export const Tag = styled.div`
    position: relative;
    height: 28px;
    line-height: 26px;
    padding: 0 15px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    text-overflow: ellipsis;
    text-align: center;
    white-space: nowrap;
    color: #2879ff;
    border: solid 1px #cde0ff;
    background-color: #ffffff;

    :not(last-child) {
        margin-right: 10px;
    }

    &:hover {
        color: #fff;
        background-color: #2879ff;
        border-color: #2879ff;
    }

    ${is('filtered')`
        color: #393636;
        background-color: #e1e1e1;
        border-color: #e1e1e1;

        &:hover {
            color: #393636;
            background-color: #ddd;
            border-color: #ddd;
        }
    `} 
    
    ${isOr('selected', 'category')`
        color: #fff;
        background-color: #2879ff;
        border-color: #2879ff;

        &:hover {
            color: #fff;
            background-color: #2174ff;
            border-color: #2174ff;
        }
    `};
`;

Tag.propTypes = {
    category: PropTypes.number,
};

Tag.defaultProps = {
    category: 0,
};

export const TagLink = Tag.withComponent(Link);
export default Tag;
