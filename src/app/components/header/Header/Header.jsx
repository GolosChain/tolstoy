import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import tt from 'counterpart';

import { REGISTRATION_URL } from 'app/client_config';

import Icon from 'golos-ui/Icon';
import IconBadge from 'golos-ui/IconBadge';
import Button from 'golos-ui/Button';
import Userpic from 'app/components/elements/Userpic';
import MobilePopover from '../MobilePopover';
import AdaptivePopover from '../AdaptivePopover';
import AccountMenu from '../AccountMenu';
import Menu from '../Menu';
import NotificationsMenu from '../NotificationsMenu';

const MIN_MOBILE_WIDTH = 768;

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
    margin: 0 20px 0 8px;

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
    margin: 0 10px;
`;

const NewPostButton = styled(Button)``;

const NewPostIcon = styled(Icon)`
    width: 16px;
    height: 16px;
    margin-right: 7px !important;
`;

const AccountInfoBlock = styled(Link)`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;

    height: 100%;
    padding: 0 20px;

    color: #393636;
    user-select: none;
    cursor: pointer;

    &:hover,
    &:focus {
        color: #393636;
    }
`;

const AccountText = styled.div`
    margin: 0 0 0 12px;
`;

const AccountName = styled.div`
    max-width: 120px;
    line-height: 18px;
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const AccountPowerBlock = styled.div`
    display: flex;

    margin-top: 3px;
    line-height: 18px;
`;

const AccountPowerValue = styled.span`
    color: #78c2d0;
    font-size: 13px;
`;

const AccountPowerBar = styled.div`
    display: flex;
    align-items: center;

    margin-right: 8px;
`;

const AccountPowerChunk = styled.div`
    width: 4px;
    height: 14px;
    margin: 0 1px;
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
    margin-left: 10px;
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
    width: 20px;
    height: 20px;
    color: #393636;
    user-select: none;
`;

const DotsWrapper = styled.div`
    padding: 10px;
    cursor: pointer;

    &:hover > ${Dots} {
        color: #2879ff;
    }

    ${is('active')`
        & > ${Dots} {
            color: #2879ff;
        }
    `};
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
        if (window.innerWidth <= MIN_MOBILE_WIDTH && !this.state.isMobile) {
            this.setState({ isMobile: true });
        }
        if (window.innerWidth > MIN_MOBILE_WIDTH && this.state.isMobile) {
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
                            Добавить пост
                        </NewPostButton>
                    </NewPostLink>
                )}
                {this.renderNotificationsBlock()}
                {/*{this.renderMessagesBlock()} uncomment when messenger done*/}
                {isMobile ? null : this.renderFullAccountBlock()}
                {isMobile ? this.renderMobileAccountBlock() : null}
            </AuthorizedBlock>
        );
    }

    renderFullAccountBlock() {
        const { currentAccountName, votingPower, realName } = this.props;

        const powerPercent = formatPower(votingPower);

        return (
            <AccountInfoBlock to={`/@${currentAccountName}`}>
                <Userpic account={currentAccountName} size={36} />
                <AccountText>
                    <AccountName>{realName}</AccountName>
                    <AccountPowerBlock>
                        <AccountPowerBar title={`Сила голоса: ${powerPercent}%`}>
                            <AccountPowerChunk fill={votingPower > 90 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 70 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 50 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 30 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 10 ? 1 : 0} />
                        </AccountPowerBar>
                        <AccountPowerValue>{powerPercent}%</AccountPowerValue>
                    </AccountPowerBlock>
                </AccountText>
            </AccountInfoBlock>
        );
    }

    renderNotificationsBlock() {
        const { freshCount } = this.props;
        const { isMobile, isNotificationsOpen } = this.state;

        return (
            <Notifications
                mobile={isMobile ? 1 : 0}
                innerRef={this.noticationsRef}
                onClick={this.onNotificationsMenuToggle}
                active={isNotificationsOpen}
            >
                <IconBadge name="bell" size={20} count={freshCount} />
            </Notifications>
        );
    }

    /* uncomment when messenger done
    renderMessagesBlock() {
        const { freshCount, currentAccountName } = this.props;
        const { isMobile } = this.state;

        return (
            <Messages to={`/@${currentAccountName}/messages`} mobile={isMobile ? 1 : 0}>
                <IconBadge name="messanger" size={21} count={0} />
            </Messages>
        );
    }*/

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
                            <DotsWrapper
                                innerRef={this.dotsRef}
                                active={isMenuOpen}
                                onClick={this.onMenuToggle}
                            >
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
                            <Menu
                                onClose={this.onMenuToggle}
                                accountName={currentAccountName}
                                onLogoutClick={this.onLogoutClick}
                            />
                        </AdaptivePopover>
                    ) : null}
                </Fixed>
                {isMobile ? null : <Filler />}
            </Root>
        );
    }
}
