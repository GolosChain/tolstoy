import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import { REGISTRATION_URL } from 'app/client_config';
import {
    getNotificationsHistoryFreshCount,
} from 'src/app/redux/actions/notifications';

import Icon from 'golos-ui/Icon';
import IconBadge from 'golos-ui/IconBadge';
import Button from 'golos-ui/Button';
import Userpic from 'app/components/elements/Userpic';
import AccountMenuDesktopWrapper from '../AccountMenuDesktopWrapper';
import MobilePopover from '../MobilePopover';
import AdaptivePopover from '../AdaptivePopover';
import AccountMenu from '../AccountMenu';
import Menu from '../Menu';
import NotificationsMenu from '../NotificationsMenu';

const MIN_MOBILE_WIDTH = 500;

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
    box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.1);
    z-index: 10;

    ${is('mobile')`
        position: relative;
        height: 56px;
    `};
`;

const Content = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1200px;
`;

const Filler = styled.div`
    height: 60px;
`;

const Splitter = styled.div`
    width: 2px;
    height: 44px;
    margin: 0 20px;
    background: #f0f0f0;
`;

const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-left: -10px;

    @media (max-width: 1230px) {
        margin-left: 8px;
    }
`;

const LogoIcon = styled(Icon)`
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    color: #2879ff;
`;

const LogoTextBlock = styled.div`
    flex-shrink: 0;
    margin-left: 9px;
`;

const LogoTitle = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: #393636;
`;

const LogoSub = styled.div`
    line-height: 11px;
    font-size: 11px;
    color: #777;
`;

const SearchBlock = styled(Link)`
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-left: 8px;
    padding-right: 10px;

    ${is('mobile')`
        padding: 10px 20px;
    `};
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

const FlexFiller = styled.div`
    flex-grow: 1;
`;

const SearchIcon = styled(Icon)`
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

const RegistrationLink = styled(Link)`
    margin-right: 12px;
`;

const LoginLink = styled(Link)`
    margin-right: 12px;
`;

const AuthorizedBlock = styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    ${is('appear')`
        animation: fade-in 0.3s;
    `};
`;

const NewPostLink = styled(Link)`
    padding: 0 10px;
`;

const NewPostButton = styled(Button)``;

const NewPostIcon = styled(Icon)`
    width: 16px;
    height: 16px;
    margin-right: 7px !important;
`;

const AccountInfoWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
`;

const AccountInfoBlock = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    cursor: pointer;
    user-select: none;
    z-index: 1;
`;

const AccountText = styled.div`
    margin: 0 12px;
`;

const AccountName = styled.div`
    max-width: 120px;
    line-height: 18px;
    font-size: 13px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const AccountPowerBlock = styled.div`
    line-height: 18px;
`;

const AccountPowerLabel = styled.span`
    margin-right: 3px;
    font-size: 13px;
    color: #999;
`;

const AccountPowerValue = styled.span`
    font-size: 13px;
`;

const AccountPowerBar = styled.div``;

const AccountPowerChunk = styled.div`
    width: 16px;
    height: 4px;
    margin: 2px 0;
    border-radius: 2px;
    background: #d8d8d8;

    ${is('fill')`
        background: #78c2d0;
    `};
`;

const Notifications = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    margin-right: 10px;
    user-select: none;
    cursor: pointer;
    color: #393636;

    ${is('mobile')`
        padding: 10px 20px;
    `};

    &:hover {
        color: #2879ff;
    }

    ${is('active')`
        color: #2879ff;
    `};
`;

const DotsWrapper = styled.div`
    padding: 10px;
    cursor: pointer;
`;

const Dots = styled(Icon)`
    display: block;
    width: 20px;
    height: 20px;
    color: #393636;
    user-select: none;
`;

const MobileAccountBlock = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 15px 0 12px;
    cursor: pointer;
    z-index: 1;
`;

const MobileAccountContainer = styled.div`
    position: relative;
    width: 50px;
    height: 50px;
`;

const UserpicMobile = styled(Userpic)`
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
`;

const PowerCircle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.1);
`;

function formatPower(percent) {
    return percent.toFixed(2).replace(/\.?0+$/, '');
}

function calcXY(angle) {
    return {
        x: Math.sin(angle),
        y: -Math.cos(angle),
    };
}

export default class Header extends PureComponent {
    static propTypes = {
        getNotificationsOnlineHistoryFreshCount: PropTypes.func.isRequired,
        getNotificationsOnlineHistory: PropTypes.func.isRequired,
    };

    state = {
        isAccountOpen: false,
        isMenuOpen: false,
        isNotificationsOpen: false,
        waitAuth: this.props.offchainAccount && !this.props.currentAccountName,
        isMobile: process.env.BROWSER ? window.innerWidth < MIN_MOBILE_WIDTH : false,
    };

    timeoutId = null;

    accountRef = React.createRef();
    dotsRef = React.createRef();
    noticationsRef = React.createRef();

    componentDidMount() {
        window.addEventListener('resize', this.onResizeLazy);
        this.props.getNotificationsOnlineHistoryFreshCount();

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
        this.setState({
            isMobile: window.innerWidth < MIN_MOBILE_WIDTH,
        });
    }, 100);


    onLoginClick = e => {
        e.preventDefault();

        this.props.onLogin();
    };

    onAccountMenuToggle = () => {
        this.setState({
            isAccountOpen: !this.state.isAccountOpen,
        });
    };

    onMenuToggle = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
        });
    };

    onNotificationsMenuToggle = () => {
        this.setState({
            isNotificationsOpen: !this.state.isNotificationsOpen,
        });
    };

    renderAuthorizedPart() {
        const { isMobile, waitAuth } = this.state;

        return (
            <AuthorizedBlock appear={waitAuth}>
                {isMobile ? null : (
                    <NewPostLink to="/submit">
                        <NewPostButton>
                            <NewPostIcon name="new-post" />
                            {tt('g.create_post')}
                        </NewPostButton>
                    </NewPostLink>
                )}
                {isMobile ? null : <Splitter />}
                {isMobile ? null : this.renderFullAccountBlock()}
                {isMobile ? null : <Splitter />}
                {this.renderNotificationsBlock()}
                {isMobile ? this.renderMobileAccountBlock() : null}
            </AuthorizedBlock>
        );
    }

    renderFullAccountBlock() {
        const { currentAccountName, votingPower } = this.props;
        const { isAccountOpen } = this.state;

        const powerPercent = formatPower(votingPower);

        return (
            <AccountInfoWrapper>
                <AccountInfoBlock onClick={this.onAccountMenuToggle}>
                    <Userpic account={currentAccountName} size={36} />
                    <AccountText>
                        <AccountName>{currentAccountName}</AccountName>
                        <AccountPowerBlock>
                            <AccountPowerLabel>{tt('token_names.VESTING_TOKEN')}:</AccountPowerLabel>
                            <AccountPowerValue>{powerPercent}%</AccountPowerValue>
                        </AccountPowerBlock>
                    </AccountText>
                    <AccountPowerBar title={`${tt('token_names.VESTING_TOKEN')}: ${powerPercent}%`}>
                        <AccountPowerChunk fill={votingPower > 90 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 70 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 50 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 30 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 10 ? 1 : 0} />
                    </AccountPowerBar>
                </AccountInfoBlock>
                {isAccountOpen ? (
                    <AccountMenuDesktopWrapper onClose={this.onAccountMenuToggle} />
                ) : null}
            </AccountInfoWrapper>
        );
    }

    renderNotificationsBlock() {
        const { freshCount } = this.props;
        const { isMobile, isNotificationsOpen } = this.state;

        return (
            <Fragment>
                <Notifications
                    mobile={isMobile ? 1 : 0}
                    innerRef={this.noticationsRef}
                    onClick={this.onNotificationsMenuToggle}
                    active={isNotificationsOpen}
                >
                    <IconBadge name="bell" size={20} count={freshCount} />
                </Notifications>
            </Fragment>
        );
    }

    renderMobileAccountBlock() {
        const { currentAccountName, votingPower } = this.props;
        const { isAccountOpen } = this.state;

        const angle = 2 * Math.PI - 2 * Math.PI * (votingPower / 100);

        const { x, y } = calcXY(angle);

        return (
            <Fragment>
                <MobileAccountBlock onClick={this.onAccountMenuToggle}>
                    <MobileAccountContainer innerRef={this.accountRef}>
                        <PowerCircle>
                            <svg viewBox="-1 -1 2 2">
                                <circle cx="0" cy="0" r="1" fill="#78c2d0" />
                                <path
                                    d={`M ${x * -1} ${y} A 1 1 0 ${
                                        angle > Math.PI ? 1 : 0
                                    } 1 0 -1 L 0 0`}
                                    fill="#393636"
                                />
                            </svg>
                        </PowerCircle>
                        <UserpicMobile account={currentAccountName} size={44} />
                    </MobileAccountContainer>
                </MobileAccountBlock>
                {isAccountOpen ? (
                    <MobilePopover
                        target={this.accountRef.current}
                        onClose={this.onAccountMenuToggle}
                    >
                        <AccountMenu onClose={this.onAccountMenuToggle} />
                    </MobilePopover>
                ) : null}
            </Fragment>
        );
    }

    render() {
        const { currentAccountName, getNotificationsOnlineHistory } = this.props;
        const { isMobile, isMenuOpen, isNotificationsOpen, waitAuth } = this.state;

        return (
            <Root>
                <Fixed mobile={isMobile ? 1 : 0}>
                    <Content>
                        <LogoLink to="/">
                            <LogoIcon name="logo" />
                            {isMobile ? null : (
                                <LogoTextBlock>
                                    <LogoTitle>GOLOS</LogoTitle>
                                    <LogoSub>beta</LogoSub>
                                </LogoTextBlock>
                            )}
                        </LogoLink>
                        <SearchBlock href="/static/search.html" mobile={isMobile ? 1 : 0}>
                            {isMobile ? <FlexFiller /> : <SearchInput />}
                            <SearchIcon name="search" />
                        </SearchBlock>
                        {isMobile ? null : <Splitter />}
                        {currentAccountName ? (
                            this.renderAuthorizedPart()
                        ) : (
                            <Buttons hidden={waitAuth}>
                                <RegistrationLink to={REGISTRATION_URL}>
                                    <Button>{tt('g.sign_up')}</Button>
                                </RegistrationLink>
                                <LoginLink to="/login" onClick={this.onLoginClick}>
                                    <Button light>{tt('g.login')}</Button>
                                </LoginLink>
                            </Buttons>
                        )}
                        {isMobile ? null : (
                            <DotsWrapper innerRef={this.dotsRef} onClick={this.onMenuToggle}>
                                <Dots name="dots" />
                            </DotsWrapper>
                        )}
                    </Content>
                    {isNotificationsOpen ? (
                        <AdaptivePopover
                            isMobile={isMobile}
                            target={this.noticationsRef.current}
                            onClose={this.onNotificationsMenuToggle}
                        >
                            <NotificationsMenu
                                params={{ accountName: currentAccountName }}
                                getNotificationsOnlineHistory={getNotificationsOnlineHistory}
                                onClose={this.onNotificationsMenuToggle}
                            />
                        </AdaptivePopover>
                    ) : null}
                    {isMenuOpen ? (
                        <AdaptivePopover
                            isMobile={isMobile}
                            target={this.dotsRef.current}
                            onClose={this.onMenuToggle}
                        >
                            <Menu onClose={this.onMenuToggle} />
                        </AdaptivePopover>
                    ) : null}
                </Fixed>
                {isMobile ? null : <Filler />}
            </Root>
        );
    }
}
