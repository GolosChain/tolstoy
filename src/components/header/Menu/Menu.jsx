import React, { PureComponent, Fragment } from 'react';
import { Link } from 'mocks/react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import { logOutboundLinkClickAnalytics } from 'src/helpers/gaLogs';

const Ul = styled.ul`
  padding: 5px 0 6px;
  margin: 0;
`;

const Li = styled.li`
  list-style: none;
`;

const LinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  height: 50px;
  padding-right: 20px;
  font-size: 14px;
  color: #333 !important;
  background-color: #fff;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 63px;
`;

const IconStyled = styled(Icon)`
  flex-shrink: 0;
  color: #393636;
`;

export default class Menu extends PureComponent {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    accountName: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onLoginClick: PropTypes.func.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
  };

  loggedInItems = [
    {
      link: `/@${this.props.accountName}/transfers`,
      icon: 'wallet2',
      text: tt('g.wallet'),
      width: 18,
      height: 18,
    },
    {
      link: '/market',
      icon: 'transfer',
      text: tt('g.market'),
      width: 20,
      height: 16,
    },
    {
      link: '//explorer.golos.io',
      icon: 'golos_explorer',
      text: 'Golos Explorer',
      width: 32,
      height: 19,
    },
    {
      link: '/~witnesses',
      icon: 'delegates',
      text: tt('navigation.delegates'),
      width: 22,
      height: 16,
    },
    {
      link: tt('link_to.telegram'),
      icon: 'technical-support',
      text: tt('navigation.technical_support'),
      width: 25,
      height: 26,
    },
    {
      link: `/@${this.props.accountName}/settings`,
      icon: 'settings-cogwheel',
      text: tt('g.settings'),
      width: 22,
      height: 22,
    },
    {
      icon: 'logout',
      text: tt('g.logout'),
      onClick: this.props.onLogoutClick,
      width: 18,
      height: 19,
    },
  ];

  loggedOutItems = [
    {
      link: '/welcome',
      icon: 'hand',
      text: tt('navigation.welcome'),
      width: 20,
      height: 25,
    },
    {
      link: '/faq',
      icon: 'round-question',
      text: tt('g.questions_answers'),
      width: 20,
      height: 20,
    },
    {
      link: '/market',
      icon: 'transfer',
      text: tt('g.market'),
      width: 20,
      height: 16,
    },
    {
      link: '//explorer.golos.io',
      icon: 'golos_explorer',
      text: 'Golos Explorer',
      width: 32,
      height: 19,
    },
    {
      link: '/~witnesses',
      icon: 'delegates',
      text: tt('navigation.delegates'),
      width: 22,
      height: 16,
    },
    {
      link: tt('link_to.telegram'),
      icon: 'technical-support',
      text: tt('navigation.technical_support'),
      width: 25,
      height: 26,
    },
    {
      icon: 'login-normal',
      text: tt('g.login'),
      hideOnDesktop: true,
      onClick: this.props.onLoginClick,
      width: 18,
      height: 19,
    },
  ];

  onItemClick = link => {
    if (link.startsWith('//')) {
      logOutboundLinkClickAnalytics(`https:${link}`);
    }
    this.props.onClose();
  };

  render() {
    const { accountName, isMobile } = this.props;
    const menuItems = accountName ? this.loggedInItems : this.loggedOutItems;

    return (
      <Ul>
        {menuItems.map(
          ({ link = '', target, icon, text, hideOnDesktop = false, onClick, width, height }, i) => (
            <Fragment key={icon}>
              {!isMobile && hideOnDesktop ? null : (
                <Li aria-label={text} onClick={() => this.onItemClick(link)}>
                  <LinkStyled
                    to={link}
                    target={link.startsWith('//') ? '_blank' : null}
                    onClick={onClick}
                  >
                    <IconWrapper>
                      <IconStyled name={icon} width={width} height={height} />
                    </IconWrapper>
                    {text}
                  </LinkStyled>
                </Li>
              )}
            </Fragment>
          )
        )}
      </Ul>
    );
  }
}
