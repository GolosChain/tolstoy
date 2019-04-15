import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'src/app/components/golos-ui/Button';

const STORAGE_KEY = 'golos.transit-to-cyber';

const Wrapper = styled.div`
    display: flex;

    & > :not(:last-child) {
        margin-right: 12px;
    }
`;

const VotedBlock = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    letter-spacing: 0.0759em;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    text-transform: uppercase;
    color: #a7a7a7;
`;

const NoWrap = styled.span`
    margin: 0 6px;
    white-space: nowrap;
`;

const ButtonStyled = styled(Button)`
    height: 40px;
    font-size: 14px;
`;

export default class VotingButtons extends PureComponent {
    state = {
        isVoted: process.env.BROWSER ? Boolean(localStorage.getItem(STORAGE_KEY)) : false,
        isVoting: false,
    };

    onYesClick = () => {
        this.vote('golosvotingyes');
    };

    onNoClick = () => {
        this.vote('golosvotingno');
    };

    vote(toAccount) {
        const { loginIfNeed } = this.props;

        loginIfNeed(logged => {
            if (!logged) {
                return;
            }

            const { transfer, currentUser, showNotification } = this.props;

            const operation = {
                from: currentUser.get('username'),
                to: toAccount,
                amount: '0.001 GOLOS',
                memo: '',
            };

            let isDone = false;

            transfer(operation, err => {
                if (isDone) {
                    return;
                }

                isDone = true;

                if (err) {
                    console.error(err);
                    showNotification(`Voting failed: ${err.message}`);
                    return;
                }

                localStorage.setItem(STORAGE_KEY, '1');

                this.setState({
                    isVoted: true,
                });

                showNotification(tt('voting_cta.voting_success'));
            });
        });
    }

    render() {
        const { className } = this.props;
        const { isVoted, isVoting } = this.state;

        if (isVoted) {
            return (
                <VotedBlock className={className}>
                    {tt('voting_cta.voted_thanks')}
                    <NoWrap>{tt('voting_cta.voted')}</NoWrap>
                </VotedBlock>
            );
        }

        return (
            <Wrapper className={className}>
                <ButtonStyled disabled={isVoting} onClick={isVoting ? null : this.onYesClick}>
                    {tt('voting_cta.vote-yes')}
                </ButtonStyled>
                <ButtonStyled disabled={isVoting} onClick={isVoting ? null : this.onNoClick}>
                    {tt('voting_cta.vote-no')}
                </ButtonStyled>
            </Wrapper>
        );
    }
}
