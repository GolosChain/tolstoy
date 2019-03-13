import React, { Component } from 'react';
import { Link } from 'mocks/react-router';
import tt from 'counterpart';
import styled from 'styled-components';

import Icon from 'components/golos-ui/Icon';

const MARGIN_POINT = 20;
const VERTICAL_VIEW_BREAK_POINT = 945;

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  height: calc(100vh - 60px);
  max-width: 870px;
  margin: 0 auto;
  color: #393636;
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;

  //background: url('/images/errors/content-error-boundary-logo.svg') right no-repeat;
  background-size: contain;

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) and (min-height: 420px) {
    flex-direction: column;
    margin: ${MARGIN_POINT * 4}px;
    height: calc(100% - ${MARGIN_POINT * 8}px);
    background-position: bottom;
  }

  @media (max-width: 768px) and (min-height: 420px) {
    margin: ${MARGIN_POINT * 4}px ${MARGIN_POINT * 2}px;
  }

  @media (max-width: 576px) and (min-height: 800px) {
    // for iPhone X (375x812)
    margin: ${MARGIN_POINT * 4}px ${MARGIN_POINT}px;
  }

  @media (max-width: 576px) and (max-height: 740px) {
    margin: ${MARGIN_POINT * 2}px;
    height: calc(100% - ${MARGIN_POINT * 4}px);
  }

  @media (max-width: 576px) and (max-height: 600px) {
    margin: ${MARGIN_POINT}px;
    height: calc(100% - ${MARGIN_POINT * 2}px);
  }

  @media (max-height: 419px) {
    // for horizontal orientation (mobile devices)
    margin: 0 ${MARGIN_POINT * 2}px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-basis: 280px;

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) and (min-height: 420px) {
    align-items: center;
    flex-basis: auto;
    margin-right: 0;
  }
`;

const InfoTitle = styled.div`
  margin-bottom: 30px;
  font-size: 34px;
  font-weight: 900;
  line-height: 1.21;
  letter-spacing: 0.4px;

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
    margin-bottom: 10px;
  }

  @media (max-width: 570px) and (max-height: 340px) {
    // for iPhone 5S
    font-size: 24px;
  }
`;

const InfoText = styled.div`
  font-size: 16px;
  line-height: 1.38;
  letter-spacing: -0.3px;

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) and (min-height: 420px) {
    text-align: center;
  }

  @media (max-width: 570px) and (max-height: 340px) {
    // for iPhone 5S
    font-size: 14px;
  }
`;

const TryReloadText = styled(InfoText)`
  margin-top: 30px;
  color: #959595;

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
    margin-top: 10px;
  }
`;

const ReloadButton = styled.div`
  display: flex;
  align-items: center;
  width: 130px;
  padding: 8px 18px;
  margin-top: 50px;
  border-radius: 68px;
  background-color: #2879ff;
  cursor: pointer;

  font-size: 12px;
  font-weight: bold;
  line-height: 1.5;
  color: #ffffff;
  text-transform: uppercase;

  &:hover {
    background: #0e69ff;
  }

  & ${Icon} {
    margin-right: 8px;
  }

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
    margin-top: 20px;
  }
`;

const WrapperLink = styled(Link)`
  font-size: 12px;
  color: #959595;
  text-decoration: underline;
  transition: none;
`;

const Links = styled.div`
  display: flex;
  margin-top: 65px;

  & ${WrapperLink}:first-child {
    margin-right: 30px;
  }

  @media (max-width: ${VERTICAL_VIEW_BREAK_POINT}px) {
    margin-top: 20px;
  }
`;

export default class ContentErrorBoundary extends Component {
  state = {
    hasError: false,
    error: '',
  };

  componentDidCatch(error) {
    this.setState({
      hasError: true,
      error: error,
    });
  }

  reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Content>
            <Info>
              <InfoTitle>{tt('error_page.oops')}</InfoTitle>
              <InfoText>{tt('error_page.text')}</InfoText>
              <TryReloadText>{tt('error_page.try_reload_text')}</TryReloadText>
              <ReloadButton onClick={this.reloadPage}>
                <Icon name="reload" size={14} />
                {tt('error_page.reload')}
              </ReloadButton>
              <Links>
                <WrapperLink to="/">{tt('error_page.link_to_main')}</WrapperLink>
                <WrapperLink to={supportLink()} target="_blank" rel="noopener norefferer">
                  {tt('error_page.link_to_support')}
                </WrapperLink>
              </Links>
            </Info>
          </Content>
        </Wrapper>
      );
    }

    return this.props.children;
  }
}

function supportLink() {
  const locale = tt.getLocale();

  switch (locale) {
    case 'en':
    case 'uk':
      return 'https://tlg.name/golos_eng';
    case 'ru':
      return 'https://tlg.name/golos_support';
  }
}
