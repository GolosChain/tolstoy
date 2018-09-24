import styled from 'styled-components';
import is from 'styled-is';
import Popover from './Popover';

export const PopoverStyled = styled(Popover)`
    @media (max-width: 768px) {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 101;
        bottom: auto;
        margin: 0;
        transform: translate(-50%, -50%);

        & > div:first-child {
            display: none;
        }
    }
`;

export const PopoverBackgroundShade = styled.div`
    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        display: none;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);

        ${is('show')`
            display: block;
        `};
    }
`;

export const ClosePopoverButton = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: ${({ showCross }) => (showCross ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;

    & svg {
        color: #e1e1e1;
        padding: 0;
    }

    &:hover svg {
        color: #b9b9b9;
    }

    @media (max-width: 768px) {
        display: flex;
    }
`;
