import React, { Component } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';

import { REGISTRATION_URL } from 'app/client_config';

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;

    margin: 20px 0;

    object-fit: contain;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Information = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;

    padding: 20px;

    @media (max-width: 768px) {
        order: 2;
    }
`;

const Rocket = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
        order: 1;
        justify-content: center;

        padding-top: 20px;
    }
`;

const Title = styled.h3`
    margin: 0;

    font-family: 'Helvetica', sans-serif;
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
    text-align: center;
`;

const Description = styled.p`
    padding: 10px 0;
    margin: 0;

    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.3px;
    text-align: left;
    color: #959595;
`;

const RegButtonLink = styled.a`
    display: block;
`;

const RegistrationButton = styled(Button)`
    text-transform: uppercase;
`;

const Divider = styled.div`
    width: 1px;
    height: 100%;

    background-color: #e1e1e1;

    @media (max-width: 768px) {
        display: none;
    }
`;

const RocketImg = styled.img`
    min-width: 133px;
    min-height: 132px;
`;

const RocketHolder = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: column;

    margin-left: 20px;
    padding-right: 20px;
`;

export default class RegistrationPanel extends Component {
    render() {
        return (
            <Wrapper>
                <Information>
                    <Title>{tt('g.sign_up_to_vote_for_post_or_write_comments')}</Title>
                    <Description>{tt('g.authors_receive_rewards_for_upvotes')}</Description>
                    <RegButtonLink href={REGISTRATION_URL}>
                        <RegistrationButton>{tt('g.sign_up_action')}</RegistrationButton>
                    </RegButtonLink>
                </Information>
                <Rocket>
                    <Divider />
                    <RocketHolder>
                        <RocketImg src="/images/post/registration-rocket.svg" />
                    </RocketHolder>
                </Rocket>
            </Wrapper>
        );
    }
}
