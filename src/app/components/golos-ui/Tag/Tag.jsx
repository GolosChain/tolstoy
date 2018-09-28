import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import { Link } from 'react-router';

export const Tag = styled.div`
    display: table-cell;
    height: 28px;
    padding: 0 12px;
    margin-right: 14px;
    border-radius: 6px;
    line-height: 26px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #799921;
    background-color: #f9f9f9;

    &:hover {
        color: #799921;
        background-color: #f9f9f9;
    }

    ${is('category')`
        color: #fff;
        background: #789821;
        
        &:hover {
            color: #fff;
            background: #789821;
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
