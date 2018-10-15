import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isNot } from 'styled-is';

import Icon from 'golos-ui/Icon';

const ToggleCommentOpen = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 30px;
    min-height: 30px;
    user-select: none;
    cursor: pointer;
    transform: rotate(0);
    transition: transform 0.4s;

    ${isNot('commentOpen')`
        color: #b7b7ba;
        transform: rotate(0.5turn);
    `};
`;

const ChevronIcon = styled(Icon)`
    flex-shrink: 0;
`;

export const CloseOpenButton = ({ isCommentOpen, toggleComment, className }) => (
    <ToggleCommentOpen
        className={className}
        commentOpen={isCommentOpen ? 1 : 0}
        onClick={toggleComment}
    >
        <ChevronIcon name="chevron" width="12" height="7" />
    </ToggleCommentOpen>
);

CloseOpenButton.propTypes = {
    isCommentOpen: PropTypes.bool.isRequired,
    toggleComment: PropTypes.func.isRequired,
};
