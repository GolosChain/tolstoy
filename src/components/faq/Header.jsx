import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Container from '../common/Container';
import { logOutboundLinkClickAnalytics } from 'src/helpers/gaLogs';

const Wrapper = styled.div`
  background-color: #f9f9f9;
`;

const HeaderContainer = styled(Container)`
  @media (max-width: 1200px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const MainBlock = styled.div`
  padding: 60px;

  @media (max-width: 1200px) {
    max-width: 100%;
    padding: 25px 16px 40px;
    text-align: center;
  }
`;

const Title = styled.h1`
  max-width: 600px;
  color: #393636;
  font-family: 'Open Sans', sans-serif;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: 0.37px;
  line-height: 41px;
`;

const Description = styled.div`
  max-width: 600px;
  margin: 12px 0 37px;
  color: #959595;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  letter-spacing: -0.26px;
  line-height: 24px;

  @media (max-width: 1200px) {
    margin-bottom: 20px;
  }
`;

const ButtonsBlock = styled.div`
  display: flex;
  justify-content: flex-start;

  @media (max-width: 1200px) {
    justify-content: center;
  }
`;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  margin-right: 15px;
  width: 138px;
  height: 34px;
  text-transform: uppercase;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: bold;
`;

const TlgButton = styled(Button)`
  color: #ffffff;
  line-height: 18px;
  text-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
  letter-spacing: 1px;
  background: #2879ff;
  transition: 0.2s;

  &:hover {
    background: #0e69ff;
    color: #fff;
  }

  &:focus {
    color: #ffffff;
  }

  @media (max-width: 1200px) {
    margin-left: 15px;
  }
`;

const SupportButton = styled(Button)`
  margin-left: 15px;
  background-color: #ffffff;
  border: 1px solid rgba(149, 149, 149, 0.3);
  transition: 0.2s;

  color: #393636;
  letter-spacing: 1.2px;
  line-height: 23px;

  &:hover {
    background: none;
    color: #393636;
  }

  &:focus {
    color: #393636;
  }

  @media (max-width: 1200px) {
    margin-left: 0;
  }
`;

const ButtonLabel = styled.div`
  margin-left: 8px;
`;

const Image = styled.div`
  flex-grow: 1;
  background: url('/images/new/faq/header-back.svg') no-repeat center;
  background-size: 451px 280px;

  @media (max-width: 1200px) {
    width: 100%;
    height: 280px;
  }

  @media (max-width: 450px) {
    height: 58vw;
    background-size: 100vw 58vw;
  }
`;

export default class Header extends PureComponent {
  logEventAnalytics = () => {
    logOutboundLinkClickAnalytics(`https:${tt('link_to.telegram')}`);
  };

  render() {
    return (
      <Wrapper>
        <HeaderContainer>
          <MainBlock>
            <Title>{tt('faq_jsq.page_title')}</Title>
            <Description>{tt('faq_jsq.page_description')}</Description>
            <ButtonsBlock>
              <TlgButton
                href={`https:${tt('link_to.telegram')}`}
                target="_blank"
                rel="noopener norefferer"
                onClick={this.logEventAnalytics}
              >
                <Icon name="telegram" size="16px" fill="#ffffff" />
                <ButtonLabel>{tt('faq_jsq.telegram')}</ButtonLabel>
              </TlgButton>
              <SupportButton href="mailto:support@golos.io" target="_blank">
                <Icon name="envelope" size="16px" />
                <ButtonLabel>{tt('faq_jsq.email')}</ButtonLabel>
              </SupportButton>
            </ButtonsBlock>
          </MainBlock>
          <Image />
        </HeaderContainer>
      </Wrapper>
    );
  }
}
