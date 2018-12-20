import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';

import LoadingIndicator from 'app/components/elements/LoadingIndicator';

const ButtonStyled = styled(Button)`
    &:not(:last-child) {
        margin-right: 8px;
    }

    @media (max-width: 890px) {
        height: 30px;
    }
`;

const IconStyled = styled(Icon)`
    margin-right: 10px;
`;

export default class VoteWitnessFollow extends Component {
    static propTypes = {
        accountUsername: PropTypes.string,
        authUser: PropTypes.string, // OPTIONAL default to current user
        showFollow: PropTypes.bool,
        showMute: PropTypes.bool,
        children: PropTypes.any,
    };

    static defaultProps = {
        showFollow: true,
        showMute: true,
    };

    state = {
        busy: false,
    };

    handleUpdateFollow(type) {
        if (this.state.busy) {
            return;
        }
        const { authUser, accountUsername, updateFollow } = this.props;

        this.setState({ busy: true });
        updateFollow(authUser, accountUsername, type, () => {
            this.setState({ busy: false });
        });
    }

    follow = () => {
        this.handleUpdateFollow('blog');
    };

    unfollow = () => {
        const { accountUsername, confirmUnfollowDialog } = this.props;
        confirmUnfollowDialog(accountUsername);
    };

    ignore = () => {
        this.handleUpdateFollow('ignore');
    };

    unignore = () => {
        this.handleUpdateFollow(null);
    };

    render() {
        const { showFollow, showMute, children, followInfo } = this.props;
        const { busy } = this.state;

        if (followInfo.loading) {
            return (
                <span>
                    <LoadingIndicator /> {tt('g.loading')}
                    &hellip;
                </span>
            );
        }

        if (followInfo.loading !== false) {
            // must know what the user is already accountUsername before any update can happen
            return null;
        }

        const { authUser, accountUsername } = this.props;
        // Show follow preview for new users
        if (!authUser || !accountUsername)
            return (
                <ButtonStyled onClick={this.follow}>
                    <IconStyled name="plus" height="14" width="14" />
                    {tt('g.follow')}
                </ButtonStyled>
            );

        // Can't follow or ignore self

        return (
            <Fragment>
                {showMute && followInfo.followState !== 'ignore' ? (
                    <ButtonStyled disabled={busy} onClick={this.ignore}>
                        {tt('g.mute')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.unignore}>
                        {tt('g.unmute')}
                    </ButtonStyled>
                )}

                {showFollow && followInfo.followState !== 'blog' ? (
                    <ButtonStyled disabled={busy} onClick={this.follow}>
                        <IconStyled name="plus" height="14" width="14" />
                        {tt('g.follow')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.unfollow}>
                        <IconStyled name="tick" height="10" width="14" />
                        {tt('g.subscriptions')}
                    </ButtonStyled>
                )}

                {children ? (
                    <span>
                        &nbsp;&nbsp;
                        {children}
                    </span>
                ) : null}
            </Fragment>
        );
    }
}
