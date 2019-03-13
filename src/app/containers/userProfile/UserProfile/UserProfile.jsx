import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { last } from 'ramda';
import tt from 'counterpart';
import Head from 'next/head';

import { blockedUsers, blockedUsersContent } from 'src/app/utils/IllegalContent';

import { listenLazy } from 'src/app/helpers/hoc';
import LoadingIndicator from 'src/app/components/elements/LoadingIndicator';
import BlockedContent from 'src/app/components/elements/BlockedContent';
import IllegalContentMessage from 'src/app/components/elements/IllegalContentMessage';
import Container from 'src/app/components/common/Container';
import UserHeader from 'src/app/components/userProfile/common/UserHeader';
import UserNavigation from 'src/app/components/userProfile/common/UserNavigation';
import UserCardAbout from 'src/app/components/userProfile/common/UserCardAbout';

const NAV_BAR_TYPES = {
  BIG: 1,
  SMALL: 2,
  MOBILE: 3,
};

const Main = styled(Container).attrs({
  align: 'flex-start',
  justify: 'center',
  small: 1,
})`
  padding: 20px 0;

  @media (max-width: 890px) {
    padding-top: 0;
    margin: 0 !important;
  }
`;

const WrapperMain = styled.div`
  background: #f9f9f9;

  @media (max-width: 890px) {
    background: #f3f3f3;
  }
`;

const Content = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 280px;

  ${is('center')`
        flex-shrink: 0;
        flex-grow: 0;
    `};

  @media (max-width: 890px) {
    order: 4;
    max-width: none;
  }
`;

const SidebarLeft = styled.div`
  width: 273px;
  flex-shrink: 0;
  margin-right: 18px;

  @media (max-width: 890px) {
    width: 100%;
    margin-right: 0;
    order: 1;
  }
`;

const SmallUserNavigation = styled(UserNavigation)`
  order: 3;
`;

@listenLazy('resize')
export default class UserProfile extends Component {
  static propTypes = {
    pageAccountName: PropTypes.string,
    isOwner: PropTypes.bool,
    params: PropTypes.object,
    route: PropTypes.object,
    routeParams: PropTypes.object,
    routes: PropTypes.array,
    router: PropTypes.any,
    content: PropTypes.any, // Routed component
    currentUser: PropTypes.object, // Immutable.Map
    currentAccount: PropTypes.object, // Immutable.Map
  };

  state = {
    navBarType: process.env.BROWSER ? this.getNavBarType() : NAV_BAR_TYPES.BIG,
  };

  getNavBarType() {
    const width = window.innerWidth;

    if (width <= 500) {
      return NAV_BAR_TYPES.MOBILE;
    } else if (width <= 768) {
      return NAV_BAR_TYPES.SMALL;
    } else {
      return NAV_BAR_TYPES.BIG;
    }
  }

  // calling by @listenLazy('resize')
  onResize() {
    const navBarType = this.getNavBarType();

    if (this.state.navBarType !== navBarType) {
      this.setState({
        navBarType,
      });
    }
  }

  render() {
    const { pageAccountName } = this.props;

    return (
      <>
        <Head>
          <title>{tt('meta.title.profile.default', { name: pageAccountName })}</title>
        </Head>
        {this._render()}
      </>
    );
  }

  _render() {
    const {
      currentUser,
      currentAccount,
      fetching,
      isOwner,
      followerCount,
      followingCount,
      uploadImage,
      updateAccount,
      notify,
    } = this.props;

    if (!currentAccount) {
      if (fetching) {
        return (
          <Main>
            <Content center>
              <LoadingIndicator type="circle" size={40} />
            </Content>
          </Main>
        );
      } else {
        return (
          <Main>
            <Content center>{tt('user_profile.unknown_account')}</Content>
          </Main>
        );
      }
    }

    if (blockedUsers.includes(currentAccount.get('name'))) {
      return <IllegalContentMessage />;
    }

    if (blockedUsersContent.includes(currentAccount.get('name'))) {
      return <BlockedContent reason={tt('g.blocked_user_content')} />;
    }

    const { navBarType } = this.state;

    const route = last(this.props.routes).path;
    const showLayoutSwitcher = !route || route === 'blog' || route === 'favorites';

    return (
      <Fragment>
        <UserHeader
          currentAccount={currentAccount}
          currentUser={currentUser}
          isOwner={isOwner}
          uploadImage={uploadImage}
          updateAccount={updateAccount}
          notify={notify}
          isSettingsPage={route === 'settings'}
        />
        {navBarType === NAV_BAR_TYPES.BIG ? (
          <UserNavigation
            accountName={currentAccount.get('name')}
            isOwner={isOwner}
            showLayout={showLayoutSwitcher}
          />
        ) : null}
        <WrapperMain>
          <Main>
            {navBarType !== NAV_BAR_TYPES.BIG ? (
              <SmallUserNavigation
                accountName={currentAccount.get('name')}
                isOwner={isOwner}
                isMobile={navBarType === NAV_BAR_TYPES.MOBILE}
                showLayout={showLayoutSwitcher}
              />
            ) : null}
            {route === 'settings' ? null : (
              <SidebarLeft>
                {route === 'transfers' ? null : (
                  <UserCardAbout
                    account={currentAccount}
                    followerCount={followerCount}
                    followingCount={followingCount}
                    currentAccount={currentAccount}
                  />
                )}
                {this.props.sidebar}
              </SidebarLeft>
            )}
            <Content center={route === 'settings'}>{this.props.content}</Content>
          </Main>
        </WrapperMain>
      </Fragment>
    );
  }
}
