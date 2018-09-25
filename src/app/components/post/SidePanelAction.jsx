import React from 'react';
import Icon from 'golos-ui/Icon';
import is from 'styled-is';
import styled from 'styled-components';

const ActionButton = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;

    ${({ activeType }) =>
        activeType === 'like'
            ? `div { color: #2879ff }`
            : activeType === 'dislike'
                ? `div { color: #ff4e00 }`
                : ``};
`;

const ActionIconWrapper = styled.div`
    display: flex;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.15s;

    &:hover {
        transform: scale(1.15);
    }
`;

const CountOf = styled.div`
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    line-height: 23px;

    ${is('count')`
        padding-top: 5px;
    `};
`;

export const Action = ({
    iconName,
    count,
    onClick,
    dataTooltip,
    activeType,
    children,
    className,
}) => {
    return (
        <ActionButton
            onClick={onClick}
            data-tooltip={dataTooltip}
            data-tooltip-html
            activeType={activeType}
            className={className}
        >
            <ActionIconWrapper>
                <Icon width="20" height="20" name={iconName} />
            </ActionIconWrapper>
            <CountOf count={count}>{count}</CountOf>
            {children}
        </ActionButton>
    );
};
