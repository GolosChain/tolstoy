import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;

    @media (max-width: 768px) {
        background-color: transparent;
        border-radius: none;
    }
`;

const ImageWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    min-height: 129px;
    padding: 0 20px 11px;

    @media (max-width: 768px) {
        min-height: 170px;
        padding: 0 35px 9px;
    }
`;

const Image = styled.img`
    width: 100%;
    max-width: 100%;
    object-fit: contain;
`;

const Header = styled.h3`
    margin: 0;
    padding-bottom: 7px;
    font-size: 18px;
    font-weight: 900;
    line-height: 2.28;
    letter-spacing: 0.3px;
    text-align: center;
    color: #393636;

    @media (max-width: 768px) {
        padding-bottom: 10px;
        font-size: 26px;
    }
`;

const Answer = styled.strong`
    display: block;
    width: 100%;
    padding: 0 20px 16px;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    color: #393636;
    text-align: left;

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const ExplanationList = styled.ul`
    width: 100%;
    margin: 0;
    padding: 0 20px 20px;
    list-style: none;

    @media (max-width: 768px) {
        padding: 0 35px 20px;
    }
`;

const Explanation = styled.li`
    &:not(:last-child) {
        padding-bottom: 20px;
    }

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const StyledIcon = styled(Icon)`
    margin-right: 15px;
    color: #2879ff;
`;

const RegButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 223px;
    min-height: 40px;
    padding: 9px 38px;
    margin-bottom: 20px;
    border-radius: 100px;
    background-color: #2879ff;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
    text-transform: uppercase;
    user-select: none;
    transition: background-color 0.15s;

    &:hover,
    &:focus {
        color: #fff;
        background-color: #0e69ff;
    }

    @media (max-width: 768px) {
        min-width: 170px;
        min-height: 34px;
        padding: 5px 22px;
        margin-bottom: 26px;
        font-size: 12px;
        line-height: 1;
    }
`;

const InfoWrapper = styled.div`
    display: flex;
    width: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
`;

const InfoLink = styled(Link)`
    width: calc(50% - 0.5px);
    padding: 13px 0;
    font-size: 12px;
    font-weight: 500;
    color: #111;
    text-align: center;
    text-transform: uppercase;
    transition: color 0.15s;

    &:hover,
    &:focus {
        color: #2879ff;
    }
`;

const Splitter = styled.div`
    height: 100%;
    width: 1px;
    background-color: #e1e1e1;
`;

export default class RegistartionBanner extends Component {
    render() {
        const { currentUser } = this.props;

        return currentUser ? null : (
            <Wrapper>
                <ImageWrapper>
                    <Image src="/images/registration-banner.svg" alt="" />
                </ImageWrapper>
                <Header>{tt('registration_banner_jsx.new_to_golos')}</Header>
                <Answer>{tt('registration_banner_jsx.everything_is_simple')}</Answer>
                <ExplanationList>
                    <Explanation>
                        <StyledIcon name="new-post" size={18} />
                        {tt('registration_banner_jsx.write_a_post')}
                    </Explanation>
                    <Explanation>
                        <StyledIcon name="like" size={18} />
                        {tt('registration_banner_jsx.community_votes')}
                    </Explanation>
                    <Explanation>
                        <StyledIcon name="brilliant" width={19} height={17} />
                        {tt('registration_banner_jsx.you_get_rewards')}
                    </Explanation>
                </ExplanationList>
                <RegButton href="https://reg.golos.io">
                    {tt('registration_banner_jsx.create_an_account')}
                </RegButton>
                <InfoWrapper>
                    <InfoLink to="/welcome">{tt('registration_banner_jsx.to_learn_more')}</InfoLink>
                    <Splitter />
                    <InfoLink to="/faq">{tt('registration_banner_jsx.faq')}</InfoLink>
                </InfoWrapper>
            </Wrapper>
        );
    }
}
