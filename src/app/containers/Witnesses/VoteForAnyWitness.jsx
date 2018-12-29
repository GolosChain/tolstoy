import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

const VoteForWitness = styled.div`
    padding: 30px 0;
`;

const VoteForWitnessTitle = styled.p``;

const InputButtonWrapper = styled.div`
    display: flex;
`;

const VoteWitnessInput = styled.input`
    padding: 10px 20px;
    width: 200px;
    height: 40px;
    border: none;
    border-radius: 85px 0 0 85px;
    box-shadow: 0 1px 11px 0 rgba(0, 0, 0, 0.06);
    background-color: #ffffff;
    transition: box-shadow 0.1s ease;
`;

const SearchForWitnessButton = styled.button`
    height: 40px;
    padding: 0 20px;
    border: none;
    border-radius: 0 85px 85px 0;
    background-color: #2879ff;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1.92;
    cursor: pointer;
`;

export default class VoteForAnyWitness extends Component {
    state = {
        customUsername: '',
    };

    onWitnessChange = e => {
        const customUsername = e.target.value;
        this.setState({ customUsername });
    };

    voteForCustomWitness = (username, vote) => {
        const { accountWitnessVote } = this.props;

        this.setState({ customUsername: '' });
        accountWitnessVote(username, vote);
    };

    render() {
        const { witnessVotes } = this.props;
        const { customUsername } = this.state;

        return (
            <VoteForWitness>
                <VoteForWitnessTitle>
                    {tt('witnesses_jsx.if_you_want_to_vote_outside_of_top_enter_account_name')}.
                </VoteForWitnessTitle>
                <InputButtonWrapper>
                    <VoteWitnessInput
                        type="text"
                        value={customUsername}
                        onChange={this.onWitnessChange}
                    />
                    <SearchForWitnessButton
                        onClick={() =>
                            this.voteForCustomWitness(
                                customUsername,
                                witnessVotes ? !witnessVotes.has(customUsername) : true
                            )
                        }
                    >
                        {tt('g.vote')}
                    </SearchForWitnessButton>
                </InputButtonWrapper>
            </VoteForWitness>
        );
    }
}
