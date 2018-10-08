import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import by from 'styled-by';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Action = styled.div`
    display: flex;
    align-items: center;
    color: ${by('color')};
    cursor: pointer;

    &:hover {
        color: #2879ff;
    }

    svg {
        min-width: ${by('size')}px;
        min-height: ${by('size')}px;
        padding: 0;
    }
`;

const ActionText = styled.div`
    margin-left: 25px;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    line-height: 44px;
    white-space: nowrap;
    cursor: pointer;
`;

const PinnedOfFavorite = ({
    isFavorite,
    isPinned,
    togglePin,
    isOwner,
    size = 20,
    showText = false,
    toggleFavorite,
}) =>
    isOwner ? (
        <Action
            onClick={togglePin}
            color={console.log(size) && isPinned ? '#2879ff' : '#333333'}
            size={size}
        >
            <Icon name="pin" width={size} height={size} />
            {showText ? <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText> : null}
        </Action>
    ) : (
        <Action onClick={toggleFavorite} size={size}>
            <Icon name={isFavorite ? 'star_filled' : 'star'} width={size} height={size} />
            {showText ? <ActionText>{tt('g.add_to_favorites')}</ActionText> : null}
        </Action>
    );

PinnedOfFavorite.propTypes = {
    isFollow: PropTypes.bool.isRequired,
    isPinned: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    togglePin: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    size: PropTypes.number,
    showText: PropTypes.bool,
};

export default PinnedOfFavorite;
