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
    flex-shrink: 0;
    margin-right: 10px;
`;

export default class VoteWitnessFollow extends Component {
    static propTypes = {
        accountUsername: PropTypes.string,
        authUser: PropTypes.string,
        showFollow: PropTypes.bool,
    };

    static defaultProps = {
        showFollow: true,
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

    voteForWitness = () => {
        const { profileButtonsInfo, authUser, accountUsername, accountWitnessVote } = this.props;

        this.setState({ busy: true });
        accountWitnessVote(
            authUser,
            accountUsername,
            !profileButtonsInfo.witnessUpvoted,
            () => this.setState({ busy: false }),
            () => this.setState({ busy: false })
        );
    };

    renderWitnessButton() {
        const { isWitness, profileButtonsInfo } = this.props;
        const { busy } = this.state;
        if (!isWitness) {
            return;
        }
        return (
            <Fragment>
                {profileButtonsInfo.witnessUpvoted ? (
                    <ButtonStyled disabled={busy} light onClick={this.voteForWitness}>
                        <IconStyled name="opposite-witness" size="16" />
                        {tt('witnesses_jsx.remove_vote_from_witness_node')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.voteForWitness}>
                        <IconStyled name="witness-logo" size="16" />
                        {tt('witnesses_jsx.vote_for_witness')}
                    </ButtonStyled>
                )}
            </Fragment>
        );
    }

    render() {
        const { authUser, profileButtonsInfo } = this.props;
        const { loading, followState } = profileButtonsInfo;
        const { busy } = this.state;

        if (loading) {
            return (
                <span>
                    <LoadingIndicator /> {tt('g.loading')}
                    &hellip;
                </span>
            );
        }

        if (!authUser)
            return (
                <ButtonStyled onClick={this.follow}>
                    <IconStyled name="plus" height="14" width="14" />
                    {tt('g.follow')}
                </ButtonStyled>
            );

        return (
            <Fragment>
                {this.renderWitnessButton()}
                {followState !== 'blog' ? (
                    <ButtonStyled disabled={busy} onClick={this.follow}>
                        <IconStyled name="plus" size="14" />
                        {tt('g.follow')}
                    </ButtonStyled>
                ) : (
                    <ButtonStyled disabled={busy} light onClick={this.unfollow}>
                        <IconStyled name="tick" height="10" width="14" />
                        {tt('g.subscriptions')}
                    </ButtonStyled>
                )}
            </Fragment>
        );
    }
}
