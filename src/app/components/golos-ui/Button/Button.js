import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import { darken } from 'polished';

export const BaseButton = styled.button`
    display: inline-flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    height: 34px;
    border-radius: 100px;

    margin: 0;
    padding: 0 12px;
    border: 0;
    outline: none;

    color: #fff;
    background: #2879ff;

    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    text-overflow: ellipsis;
    text-decoration: none;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 1.4px;
    white-space: nowrap;

    cursor: pointer;

    &::-moz-focus-inner {
        padding: 0;
        border: 0;
    }

    &:hover {
        background: ${darken(0.05, '#2879FF')};
    }

    svg {
        margin-right: 6px;
    }

    &:disabled {
        opacity: 0.8;
        cursor: default;
    }

    ${is('auto')`
        width: 100%;
    `};

    ${is('light')`
        color: #393636;
        background: #ffffff;
        border: 1px solid rgba(57, 54, 54, .3);
        &:focus {
            color: #393636;
            background: #ffffff;
            border: 1px solid ${darken(0.05, 'rgba(57, 54, 54, .3)')};
        }
        &:hover {
            color: #2879ff;
            background: #ffffff;
            border: 1px solid rgba(40, 121, 255, .3);
        }
    `};
`;

BaseButton.propTypes = {
    type: PropTypes.string,
    auto: PropTypes.bool,
    light: PropTypes.bool,
};

const Button = styled(BaseButton)``;
Button.defaultProps = {
    type: 'button',
};

export const ButtonLink = BaseButton.withComponent(Link);
export default Button;
