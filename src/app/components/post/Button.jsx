import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import Icon from '../../components/golos-ui/Icon/Icon';

const ButtonBlock = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.buttonWidth}px;
    padding: 5px 0;
    border-radius: 100px;
    outline: none;
    cursor: pointer;

    ${props => (props.buttonType === 'white') && `
        color: #393636;
        border: 1px solid #e1e1e1;
        background-color: #ffffff;
    `};
    
    ${props => (props.buttonType === 'blue') && `
        color: #ffffff;
        background-color: #2879ff;
    `};
    
    svg {
        min-width: ${props => props.iconWidth};
        min-height: ${props => props.iconHeight};
    }
`;

const Text = styled.div`
    margin-left: 6px;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
    text-align: center;
    text-transform: uppercase;
    text-shadow: 0 2px 12px rgba(0, 0, 0, .15);
`;

const Button = ({ buttonType, text, icon, buttonWidth, iconWidth, iconHeight }) => {
    return (
        <ButtonBlock
            buttonWidth={buttonWidth}
            iconWidth={iconWidth}
            iconHeight={iconHeight}
            buttonType={buttonType}
        >
            <Icon width={iconWidth} height={iconHeight} name={icon} />
            <Text>{text}</Text>
        </ButtonBlock>
    );
};

Button.propTypes = {
    buttonType: PropTypes.string,
    text: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    buttonWidth: PropTypes.number,
    iconWidth: PropTypes.number.isRequired,
    iconHeight: PropTypes.number.isRequired
};

Button.defaultProps = {
    buttonType: 'white',
    buttonWidth: 160
};

export default Button;
