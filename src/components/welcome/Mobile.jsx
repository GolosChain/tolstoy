import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import MobileBanners from 'src/components/elements/MobileBanners/MobileBanners';

const Root = styled.section`
  padding: 20px 0;
  background-color: #f8f8f8;
`;

const Row = styled.div`
  min-height: 606px;
`;

const Header = styled.div`
  font-family: ${a => a.theme.fontFamilySerif};
  font-size: 34px;
  line-height: 1.37;
  letter-spacing: 0.6px;
  color: #333333;
`;

const SubHeader = styled.div`
  max-width: 25em;
  margin-top: 28px;
  line-height: 1.75;
  font-size: 17px;
  color: #9fa3a7;
  font-family: 'Open Sans', sans-serif;
`;

const MobileLinks = styled.div`
  @media screen and (max-width: 39.9375em) {
    display: flex;
    justify-content: center;
  }

  & .mobile-banners-wrapper {
    margin: 0 -11px;

    @media screen and (max-width: 39.9375em) {
      margin-bottom: 40px;
    }

    img {
      max-height: 70px;
    }
  }
`;

export default class Mobile extends PureComponent {
  render() {
    return (
      <Root>
        <Row className="row align-middle">
          <div className="columns small-12 medium-6">
            <Header>
              {tt('welcome_page.mobile_1')}
              <br />
              {tt('welcome_page.mobile_2')}
              <br />
              {tt('welcome_page.mobile_3')}
            </Header>
            {/* <SubHeader>
                        </SubHeader> */}
            <MobileLinks>
              <MobileBanners showAndroid />
            </MobileLinks>
          </div>
          <div className="columns small-12 medium-6">
            <img src="images/new/welcome/welcome__about.svg" />
          </div>
        </Row>
      </Root>
    );
  }
}
