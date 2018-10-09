import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    padding-right: 10px;
    display: flex;
    align-items: center;
    line-height: 29px;
    font-family: ${a => a.theme.fontFamily};
    font-size: 20px;
    font-weight: bold;
    color: #212121;
    overflow: hidden;
`;

const TitleIcon = styled(Icon)`
    position: relative;
    height: 20px;
    min-width: 24px;
    margin-right: 6px;
    margin-bottom: -3px;
`;

const TitleLink = styled(Link)`
    color: #212121 !important;
    text-decoration: underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ReLink = ({ fullParentURL, title, onTitleClick }) => {
    return (
        <Wrapper>
            <TitleIcon name="comment" />
            {tt('g.re2')}
            :&nbsp;
            <TitleLink to={fullParentURL} onClick={onTitleClick}>
                {title}
            </TitleLink>
        </Wrapper>
    );
};

ReLink.propTypes = {
    fullParentURL: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onTitleClick: PropTypes.string.isRequired,
};
