import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';

import tt from 'counterpart';

import { updateFollow } from 'src/app/redux/actions/follow';
import { currentUsernameSelector } from 'src/app/redux/selectors/common';
import { muteSelector } from 'src/app/redux/selectors/follow/follow';

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
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: #7a7a7a;
    }

    ${is('auto')`
        min-width: 100%;
    `}
`;

const UnmuteButton = styled(Button)`
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;

    ${is('auto')`
        min-width: 100%;
    `}
`;

@connect(
    (state, props) => ({
        ...muteSelector(state, props),
        username: currentUsernameSelector(state),
    }),
    (dispatch, { muting }) => ({
        updateFollow: (follower, action) => {
            dispatch(updateFollow(follower, muting, action));
        },
    })
)
export default class Mute extends Component {

    static propTypes = {
        muting: PropTypes.string.isRequired,
        auto: PropTypes.bool,
        onClick: PropTypes.func,

        username: PropTypes.string,
        isFollow: PropTypes.bool,
    };

    static defaultProps = {
        onClick: () => {},
    };

    mute = e => {
        this.props.updateFollow(this.props.username, 'ignore');
        this.props.onClick(e);
    };

    unmute = e => {
        this.props.updateFollow(this.props.username, null);
        this.props.onClick(e);
    };

    render() {
        const { auto, isMute } = this.props;
        return isMute ? (
            <UnmuteButton auto={auto} light onClick={this.unmute}>
                {tt('g.unmute')}
            </UnmuteButton>
        ) : (
            <MuteButton auto={auto} onClick={this.mute}>
                {tt('g.mute')}
            </MuteButton>
        );
    }
}
