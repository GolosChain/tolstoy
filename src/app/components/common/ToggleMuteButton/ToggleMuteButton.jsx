import React, { Fragment } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import Button from '../../golos-ui/Button/Button';
import PropTypes from 'prop-types';

const MuteButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    min-height: 100%;
    padding: 0 10px;
    color: #959595;
    font: 12px 'Open Sans', sans-serif;
    font-weight: bold;
    line-height: 23px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, .15);
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: #7a7a7a;
    }
`;

const UnmuteButton = Button.extend`
    min-width: 100%;
    min-height: 100%;
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

const ToggleMuteButton = ({ isMute, muteUser, unmuteUser, className }) => {
    return (
        <div className={className}>
            {isMute ? (
                <UnmuteButton light onClick={unmuteUser}>
                    {tt('g.unmute')}
                </UnmuteButton>
            ) : (
                <MuteButton onClick={muteUser}>
                    {tt('g.mute')}
                </MuteButton>
            )}
        </div>
    );
};

ToggleMuteButton.propTypes = {
    isMute: PropTypes.bool.isRequired,
    muteUser: PropTypes.func,
    unmuteUser: PropTypes.func,
};

export default ToggleMuteButton;
