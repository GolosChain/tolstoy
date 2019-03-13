import React, { PureComponent, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'mocks/react-router';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import { REGISTRATION_URL } from 'constants/config';
import {
  CONTAINER_FULL_WIDTH,
  CONTAINER_MOBILE_WIDTH,
  CONTAINER_BASE_MARGIN,
  CONTAINER_MOBILE_MARGIN,
} from 'constants/container';

import Icon from 'components/golos-ui/Icon';
import IconBadge from 'components/golos-ui/IconBadge';

import Button from 'components/golos-ui/Button';

import Menu from '../Menu';
import NotificationsMenu from '../NotificationsMenu';
import Popover from 'components/header/Popover/Popover';
import LocaleSelect from '../LocaleSelect';
import AccountInfo from '../AccountInfo';
import AccountInfoMobile from '../AccountInfoMobile';

const MIN_PAD_WIDTH = 768;
const MIN_MOBILE_WIDTH = 576;

const Root = styled.div``;

const Fixed = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;

  height: 60px;

  background: #fff;
  border-bottom: 1px solid #e9e9e9;
  z-index: 15;

  ${is('mobile')`
        position: relative;
        border: none;
    `};
`;

const HeaderStub = styled.div`
  height: 60px;
`;

const ContainerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${CONTAINER_FULL_WIDTH}px;
  margin: 0 auto;

  @media (max-width: ${CONTAINER_FULL_WIDTH}px) {
    width: 100%;
    margin: 0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
  user-select: none;

  @media (max-width: 500px) {
    margin-left: 0;
    margin-right: 0;
  }
`;

const LocaleWrapper = styled(IconWrapper)`
  position: relative;
  width: unset;
  z-index: 2;

  @media (max-width: 345px) {
    display: none;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 10px;
  margin-left: ${CONTAINER_BASE_MARGIN - 10}px;

  @media (max-width: ${CONTAINER_MOBILE_WIDTH}px) {
    margin-left: ${CONTAINER_MOBILE_MARGIN - 10}px;
  }

  @media (max-width: 400px) {
    padding: 10px 8px;
  }

  @media (max-width: 340px) {
    padding-right: 4px;
  }
`;

const LogoIcon = styled.div`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: url('/images/header/logo-golos.svg') center no-repeat;
  background-size: contain;
  color: #2879ff;
`;

const LogoText = styled.div`
  flex-shrink: 0;
  margin-left: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #393636;
`;

const SearchBlock = styled(Link)`
  display: flex;
  flex-grow: 1;
  align-items: center;

  @media (max-width: ${MIN_PAD_WIDTH}px) {
    flex-grow: 0;
  }

  ${is('mobile')`
        margin: 0;
        padding: 8px 10px;
    `};
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  border: none;
  background: none;
  font-size: 16px;
  outline: none;
`;

const SearchIcon = styled(Icon)`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  color: #393636;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  opacity: 1;
  transition: opacity 0.3s;
  will-change: opacity;

  ${is('hidden')`
        opacity: 0;
    `};
`;

const SignUp = styled.a`
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }
`;

const SignIn = SignUp.withComponent(Link);

const NewPostLink = styled(Link)`
  display: flex;
  height: 48px;
  align-items: center;
  margin: 0 10px;

  @media (max-width: 576px) {
    display: none;
  }
`;

const MobileNewPostLink = styled(IconWrapper.withComponent(Link))`
  color: #393636;

  @media (min-width: 577px) {
    display: none;
  }
`;

const NewPostIcon = styled(Icon).attrs({ name: 'new-post' })`
  width: 16px;
  height: 16px;
  margin-right: 7px;

  ${is('mobile')`
        width: 20px;
        height: 20px;
        margin: 0;
    `}
`;

const Notifications = styled(IconWrapper)`
  color: #393636;

  &:hover {
    color: #2879ff;
  }

  ${is('active')`
        color: #2879ff;
    `};

  ${is('mobile')`
        margin-left: 0;
    `};
`;

/* uncomment when messenger done
const Messages = styled(Link)`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-left: 10px;
    user-select: none;
    cursor: pointer;
    color: #393636;
    transition: none;

    ${is('mobile')`
        padding: 10px 20px;
        margin-left: 0;
    `};

    &:focus {
        color: #393636;
    }

    &:hover {
        color: #2879ff;
    }
`;*/

const Dots = styled(Icon)`
  display: block;
  color: #393636;
  user-select: none;
`;

const DotsWrapper = styled(IconWrapper)`
  &:hover > ${Dots} {
    color: #2879ff;
  }

  ${is('active')`
        & > ${Dots} {
            color: #2879ff;
        }
    `};

  ${is('pad')`
        padding: 10px 20px;
    `};

  ${is('mobile')`
        padding: 10px 16px;
    `};

  @media (max-width: 400px) {
    ${is('mobile')`
            padding: 10px 8px;
        `};
  }
`;

export default class Header extends PureComponent {
  static propTypes = {
    getNotificationsOnlineHistoryFreshCount: PropTypes.func.isRequired,
    onChangeLocale: PropTypes.func,
  };

  state = {
    isAccountOpen: false,
    isMenuOpen: false,
    isNotificationsOpen: false,
    waitAuth: this.props.offchainAccount && !this.props.currentUsername,
    isPadScreen: process.env.BROWSER ? window.innerWidth < MIN_PAD_WIDTH : false,
    isMobile: process.env.BROWSER ? window.innerWidth < MIN_MOBILE_WIDTH : false,
  };

  timeoutId = null;

  accountRef = createRef();
  dotsRef = createRef();
  notificationsRef = createRef();

  componentDidMount() {
    window.addEventListener('resize', this.onResizeLazy);
    // TODO
    //this.props.getNotificationsOnlineHistoryFreshCount();

    if (this.state.waitAuth) {
      this.timeoutId = setTimeout(() => {
        this.setState({
          waitAuth: false,
        });
      }, 2000);
    }
  }

  componentWillUnmount() {
    this.onResizeLazy.cancel();
    window.removeEventListener('resize', this.onResizeLazy);
    clearTimeout(this.timeoutId);
  }

  onResizeLazy = throttle(() => {
    const { isPadScreen, isMobile } = this.state;
    const windowWidth = window.innerWidth;

    if (windowWidth <= MIN_PAD_WIDTH && !isPadScreen) {
      this.setState({ isPadScreen: true });
    }
    if (windowWidth > MIN_PAD_WIDTH && isPadScreen) {
      this.setState({ isPadScreen: false });
    }
    if (windowWidth <= MIN_MOBILE_WIDTH && !isMobile) {
      this.setState({ isMobile: true });
    }
    if (windowWidth > MIN_MOBILE_WIDTH && isMobile) {
      this.setState({ isMobile: false });
    }
  }, 100);

  onLoginClick = e => {
    e.preventDefault();

    this.props.onLogin();
  };

  onLogoutClick = e => {
    e.preventDefault();

    this.props.onLogout();
  };

  onMenuToggle = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  };

  onNotificationsMenuToggle = e => {
    const { freshCount } = this.props;
    const { isNotificationsOpen } = this.state;

    if (isNotificationsOpen) {
      e.preventDefault();

      this.setState({
        isNotificationsOpen: false,
      });
    } else if (freshCount > 0) {
      e.preventDefault();

      this.setState({
        isNotificationsOpen: true,
      });
    }
  };

  onNotificationsMenuClose = () => {
    this.setState({
      isNotificationsOpen: false,
    });
  };

  onCloseReadOnlyClick = () => {
    this.setState({
      hideReadOnlyWarning: true,
    });
  };

  renderAuthorizedPart() {
    const { currentUsername, votingPower, realName } = this.props;
    const { isPadScreen } = this.state;

    return (
      <Fragment>
        <NewPostLink to="/submit">
          <Button>
            <NewPostIcon />
            {tt('g.create_post')}
          </Button>
        </NewPostLink>
        <MobileNewPostLink to="/submit" aria-label={tt('g.create_post')}>
          <NewPostIcon mobile={1} />
        </MobileNewPostLink>
        {this.renderNotificationsBlock()}
        {/*{this.renderMessagesBlock()} uncomment when messenger done*/}
        {this.renderLocaleBlock()}
        {isPadScreen ? (
          <AccountInfoMobile currentUsername={currentUsername} votingPower={votingPower} />
        ) : (
          <AccountInfo
            currentUsername={currentUsername}
            votingPower={votingPower}
            realName={realName}
          />
        )}
      </Fragment>
    );
  }

  renderNotificationsBlock() {
    const { freshCount, currentUsername } = this.props;
    const { isNotificationsOpen } = this.state;

    return (
      <Link
        role="button"
        to={`/@${currentUsername}/activity`}
        aria-label={tt('aria_label.notifications', { count: freshCount })}
        onClick={this.onNotificationsMenuToggle}
      >
        <Notifications active={isNotificationsOpen ? 1 : 0} ref={this.notificationsRef}>
          <IconBadge name="bell" size={20} count={freshCount} />
        </Notifications>
      </Link>
    );
  }

  /* uncomment when messenger done
    renderMessagesBlock() {
        const { freshCount, currentUsername } = this.props;
        const { isPadScreen } = this.state;

        return (
            <Messages to={`/@${currentUsername}/messages`} mobile={isPadScreen ? 1 : 0}>
                <IconBadge name="messanger" size={21} count={0} />
            </Messages>
        );
    }*/

  renderLocaleBlock() {
    return (
      <LocaleWrapper>
        <LocaleSelect onChangeLocale={this.props.onChangeLocale} />
      </LocaleWrapper>
    );
  }

  render() {
    const { currentUsername } = this.props;
    const { isMenuOpen, isNotificationsOpen, waitAuth, isPadScreen, isMobile } = this.state;

    return (
      <Root>
        <Fixed mobile={isPadScreen ? 1 : 0}>
          <ContainerWrapper>
            <LogoLink to="/" aria-label={tt('aria_label.header_logo')}>
              <LogoIcon />
              {isPadScreen ? null : <LogoText>GOLOS</LogoText>}
            </LogoLink>
            {isPadScreen && !isMobile ? <Filler /> : null}
            <SearchBlock href="/static/search.html" aria-label={tt('g.search')}>
              {isPadScreen ? null : <SearchInput />}
              <IconWrapper>
                <SearchIcon name="search" />
              </IconWrapper>
            </SearchBlock>
            {currentUsername ? (
              this.renderAuthorizedPart()
            ) : (
              <Fragment>
                {this.renderLocaleBlock()}
                <Buttons hidden={waitAuth}>
                  <SignUp href={REGISTRATION_URL}>
                    <Button>{tt('g.sign_up')}</Button>
                  </SignUp>
                  {isMobile ? null : (
                    <SignIn to="/login" onClick={this.onLoginClick}>
                      <Button light>{tt('g.login')}</Button>
                    </SignIn>
                  )}
                </Buttons>
              </Fragment>
            )}
            <DotsWrapper
              role="button"
              aria-label={tt('aria_label.additional menu')}
              ref={this.dotsRef}
              active={isMenuOpen}
              pad={isPadScreen ? 1 : 0}
              mobile={isMobile ? 1 : 0}
              onClick={this.onMenuToggle}
            >
              <Dots name="dots" width="4" height="20" />
            </DotsWrapper>
          </ContainerWrapper>
          {isNotificationsOpen ? (
            <Popover
              notificationMobile={isMobile}
              target={this.notificationsRef.current}
              onClose={this.onNotificationsMenuClose}
            >
              <NotificationsMenu
                params={{ accountName: currentUsername }}
                onClose={this.onNotificationsMenuClose}
                isMobile={isMobile}
              />
            </Popover>
          ) : null}
          {isMenuOpen ? (
            <Popover
              menuMobile={isPadScreen}
              target={this.dotsRef.current}
              onClose={this.onMenuToggle}
            >
              <Menu
                isMobile={isMobile}
                accountName={currentUsername}
                onClose={this.onMenuToggle}
                onLoginClick={this.onLoginClick}
                onLogoutClick={this.onLogoutClick}
              />
            </Popover>
          ) : null}
        </Fixed>
        {isPadScreen ? null : <HeaderStub />}
      </Root>
    );
  }
}
