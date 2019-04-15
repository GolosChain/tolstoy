import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import { VOTING_TIME_END } from 'src/app/components/home/sidebar/VotingCTA/VotingCTA';
import VotingButtons from 'src/app/components/home/sidebar/VotingButtons';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0 50px;
`;

const Title = styled.div`
    max-width: 500px;
    margin-bottom: 20px;
    line-height: 1.27em;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #000;
`;

const VotingButtonsStyled = styled(VotingButtons)`
    & > button {
        padding: 0 24px;
    }
`;

export default class CyberVotingPanel extends PureComponent {
    render() {
        if (Date.now() >= VOTING_TIME_END) {
            return null;
        }

        return (
            <Wrapper>
                <Title>{tt('voting_cta.in_post_title')}</Title>
                <VotingButtonsStyled />
            </Wrapper>
        );
    }
}
