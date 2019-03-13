import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Navigation from 'src/app/components/common/Navigation';
import LayoutSwitcher from 'src/app/components/common/LayoutSwitcher';
import NavigationMobile from 'src/app/components/common/NavigationMobile';
import { listenLazy } from 'src/app/helpers/hoc';

const MobileWrapper = styled.div`
  border-top: 1px solid #e1e1e1;
`;

@listenLazy('resize')
export default class MainNavigation extends PureComponent {
  state = {
    isMobileNavigation: process.env.BROWSER ? this.isMobileNavigation() : false,
  };

  isMobileNavigation() {
    return window.innerWidth < 500;
  }

  onResize() {
    const isMobileNavigation = this.isMobileNavigation();

    if (this.state.isMobileNavigation !== isMobileNavigation) {
      this.setState({ isMobileNavigation });
    }
  }

  render() {
    const { myAccountName, search, className } = this.props;
    const { isMobileNavigation } = this.state;

    const tabLinks = [];

    if (myAccountName) {
      tabLinks.push({ text: tt('header_jsx.home'), to: `/@${myAccountName}/feed${search}` });
    }

    tabLinks.push(
      { text: tt('g.new'), to: `/created${search}` },
      { text: tt('main_menu.hot'), to: `/hot${search}` },
      { text: tt('main_menu.trending'), to: `/trending${search}`, index: true },
      { text: tt('g.promoted'), to: `/promoted${search}` }
    );

    if (isMobileNavigation) {
      return (
        <MobileWrapper>
          <NavigationMobile
            tabLinks={tabLinks}
            rightItems={<LayoutSwitcher mobile />}
            className={className}
          />
        </MobileWrapper>
      );
    } else {
      return (
        <Navigation tabLinks={tabLinks} rightItems={<LayoutSwitcher />} className={className} />
      );
    }
  }
}
