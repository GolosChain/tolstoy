import React from 'react';
import is from 'styled-is';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;

    div {
        color: ${({ activeType }) =>
            activeType === 'like' ? '#2879ff' : activeType === 'dislike' ? '#ff4e00' : ''};
    }
`;

const IconWrapper = styled.div`
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
        <Wrapper
            onClick={onClick}
            data-tooltip={dataTooltip}
            data-tooltip-html
            activeType={activeType}
            className={className}
        >
            <IconWrapper>
                <Icon width="20" height="20" name={iconName} />
            </IconWrapper>
            <CountOf count={count}>{count}</CountOf>
            {children}
        </Wrapper>
    );
};
