import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';

const MuteButton = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    color: #959595;
    font: 12px 'Open Sans', sans-serif;
    font-weight: bold;
    line-height: 23px;
    text-transform: uppercase;
    user-select: none;
    cursor: pointer;

    &:hover {
        color: #7a7a7a;
    }
`;

const UnmuteButton = styled(Button)`
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

export class Mute extends Component {
    static propTypes = {
        muting: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    mute = e => {
        this.updateFollow('ignore');
        this.props.onClick(e);
    };

    unmute = e => {
        this.updateFollow(null);
        this.props.onClick(e);
    };

    updateFollow(action) {
        const { username, muting } = this.props;

        this.props.updateFollow(username, muting, action);
    }

    render() {
        const { isMute, className } = this.props;
        return isMute ? (
            <UnmuteButton light className={className} onClick={this.unmute}>
                {tt('g.unmute')}
            </UnmuteButton>
        ) : (
            <MuteButton className={className} onClick={this.mute}>
                {tt('g.mute')}
            </MuteButton>
        );
    }
}
