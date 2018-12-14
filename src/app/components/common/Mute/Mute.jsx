import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';

import { muteSelector } from 'src/app/redux/selectors/follow/follow';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { updateFollow } from 'src/app/redux/actions/follow';

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

@connect(
    (state, props) => {
        return {
            ...muteSelector(state, props),
            username: currentUsernameSelector(state),
        };
    },
    {
        updateFollow,
    }
)
export default class Mute extends Component {
    static propTypes = {
        muting: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    render() {
        const { isMute, className } = this.props;
        return isMute ? (
            <UnmuteButton light onClick={this.unmute} className={className}>
                {tt('g.unmute')}
            </UnmuteButton>
        ) : (
            <MuteButton onClick={this.mute} className={className}>
                {tt('g.mute')}
            </MuteButton>
        );
    }

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
}
