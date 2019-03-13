import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';
import { Link } from 'mocks/react-router';

import Icon from 'golos-ui/Icon';
import LayoutSwitcher from 'src/components/common/LayoutSwitcher';
import Navigation from 'src/components/common/Navigation';
import NavigationMobile from 'src/components/common/NavigationMobile';

const SettingsLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  color: #393636;

  &:hover {
    color: #2879ff;
  }
`;

const GearIcon = styled(Icon)`
  width: 17px;
  height: 17px;
`;

export default class UserNavigation extends PureComponent {
  static propTypes = {
    accountName: PropTypes.string,
    isOwner: PropTypes.bool,
    isMobile: PropTypes.bool,
    showLayout: PropTypes.bool,
  };

  render() {
    const { accountName, isOwner, isMobile, showLayout, className } = this.props;

    const tabLinks = [];
    const rightItems = [];

    tabLinks.push(
      { text: tt('g.blog'), to: `/@${accountName}` },
      { text: tt('g.comments'), to: `/@${accountName}/comments` },
      { text: tt('g.replies'), to: `/@${accountName}/recent-replies` }
    );

    if (isOwner) {
      tabLinks.push({ text: tt('g.favorites'), to: `/@${accountName}/favorites` });
    }

    tabLinks.push({ text: tt('g.wallet'), to: `/@${accountName}/transfers` });

    if (isOwner) {
      tabLinks.push({ text: tt('g.activity'), to: `/@${accountName}/activity` });

      if (isMobile) {
        rightItems.push(
          <SettingsLink key="settings" to={`/@${accountName}/settings`}>
            <GearIcon name="gear" />
          </SettingsLink>
        );
      } else {
        tabLinks.push({ text: tt('g.settings'), to: `/@${accountName}/settings` });
      }

      // { text: tt('g.messages'), to: `/@${accountName}/messages` },
    }

    if (showLayout) {
      rightItems.push(<LayoutSwitcher key="layout" mobile={isMobile} />);
    }

    const rightFragment = rightItems.length ? <Fragment>{rightItems}</Fragment> : null;

    if (isMobile) {
      return (
        <NavigationMobile tabLinks={tabLinks} rightItems={rightFragment} className={className} />
      );
    } else {
      return (
        <Navigation tabLinks={tabLinks} compact rightItems={rightFragment} className={className} />
      );
    }
  }
}
