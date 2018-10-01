import React, { Component } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;

    margin-top: 20px;

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
    align-items: center;
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

const Title = styled.div`
    font-family: Helvetica, sans-serif;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
`;

const Description = styled.div`
    margin-top: 10px;

    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.3px;
    text-align: center;
    color: #959595;
`;

const RegButtonLink = styled(Link)`
    display: block;

    margin-top: 10px;
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

const RocketHolder = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-direction: column;

    margin-left: 20px;
    padding-right: 20px;

    ${Icon} {
        min-width: 133px;
        min-height: 132px;
    }
`;

export default class RegistrationPanel extends Component {
    render() {
        return (
            <Wrapper>
                <Information>
                    <Title>
                        Зарегистрируйтесь, чтобы проголосовать за пост или написать комментарий
                    </Title>
                    <Description>
                        Авторы получают вознаграждение, когда пользователи голосуют за их посты.
                        Голосующие читатели также получают вознаграждение за свои голоса.
                    </Description>
                    <RegButtonLink to="https://reg.golos.io/">
                        <RegistrationButton>{tt('g.sign_up_action')}</RegistrationButton>
                    </RegButtonLink>
                </Information>
                <Rocket>
                    <Divider />
                    <RocketHolder>
                        <Icon name="registration-rocket" width="133" height="132" />
                    </RocketHolder>
                </Rocket>
            </Wrapper>
        );
    }
}
