import React, { PureComponent, Fragment, createRef } from 'react';
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
import Container from 'src/app/components/common/Container';
import Userpic from 'app/components/elements/Userpic';
import Menu from '../Menu';
import NotificationsMenu from '../NotificationsMenu';
import Popover from 'src/app/components/header/Popover/Popover';
import LocaleSelect from '../LocaleSelect';

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

    background: #ffffff;
    border-bottom: 1px solid #e9e9e9;
    z-index: 10;

    ${is('mobile')`
        position: relative;
        
        border: none;
    `};
`;

const ContainerWrapper = styled(Container)`
    @media (max-width: 350px) {
        margin-right: 0;
        overflow: hidden;
    }
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
        margin-left: 0;
    }
`;

const LogoIcon = styled.div`
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    background: url('/images/header/logo-santa.svg') center no-repeat;
    background-size: contain;
    color: #2879ff;

    ${is('mobile')`
        width: 32px;
        height: 32px;
    `};
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
    align-items: center;
    flex-grow: 1;
    margin: 0 20px 0 8px;

    ${is('pad')`
        padding: 10px 20px;
        margin-right: 0;
    `};

    ${is('mobile')`
        margin: 0 4px 0 0;
        padding: 8px;
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

const LocaleSelectWrapper = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
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

    @media (max-width: ${MIN_MOBILE_WIDTH}px) {
        order: 2;
    }

    @media (max-width: 350px) {
        margin-right: -15px;
    }
`;

const SignIn = SignUp.withComponent(Link);

const SignInMobile = styled(Link)`
    display: flex;
    order: 1;
    margin-right: 4px;
    padding: 9px 14px;
    color: #393636;
    transition: none;

    &:hover {
        color: #2879ff;
    }

    @media (max-width: 350px) {
        padding: 9px 10px;
    }
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

const NewPostIcon = styled(Icon)`
    width: 16px;
    height: 16px;
    margin-right: 7px;
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
    color: #2879ff;
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
    background: #cde0ff;

    ${is('fill')`
        background: #2879ff;
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
        margin-left: 0;
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

    ${is('mobile')`
        padding: 10px 20px;
    `};
`;

const MobileAccountBlock = styled(Link)`
    display: flex;
    align-items: center;

    height: 100%;
    padding: 0 15px 0 12px;

    cursor: pointer;
    z-index: 1;

    ${is('mobile')`
        padding: 0 10px;
    `};
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

    renderAuthorizedPart() {
        const { isPadScreen, waitAuth, isMenuOpen } = this.state;

        return (
            <AuthorizedBlock appear={waitAuth}>
                {isPadScreen ? null : (
                    <NewPostLink to="/submit">
                        <Button>
                            <NewPostIcon name="new-post" />
                            {tt('g.create_post')}
                        </Button>
                    </NewPostLink>
                )}
                {this.renderNotificationsBlock()}
                {/*{this.renderMessagesBlock()} uncomment when messenger done*/}
                {this.renderLocaleBlock()}
                {isPadScreen ? null : this.renderFullAccountBlock()}
                {isPadScreen ? this.renderMobileAccountBlock() : null}
                <DotsWrapper
                    role="button"
                    aria-label={tt('aria_label.additional menu')}
                    innerRef={this.dotsRef}
                    active={isMenuOpen}
                    mobile={isPadScreen ? 1 : 0}
                    onClick={this.onMenuToggle}
                >
                    <Dots name="dots" />
                </DotsWrapper>
            </AuthorizedBlock>
        );
    }

    renderFullAccountBlock() {
        const { currentUsername, votingPower, realName } = this.props;

        const powerPercent = formatPower(votingPower);

        return (
            <AccountInfoBlock to={`/@${currentUsername}`}>
                <Userpic account={currentUsername} size={36} ariaLabel={tt('aria_label.avatar')} />
                <AccountText>
                    <AccountName>{realName}</AccountName>
                    <AccountPowerBlock>
                        <AccountPowerBar title={`Сила голоса: ${powerPercent}%`}>
                            <AccountPowerChunk fill={votingPower > 10 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 30 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 50 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 70 ? 1 : 0} />
                            <AccountPowerChunk fill={votingPower > 90 ? 1 : 0} />
                        </AccountPowerBar>
                        <AccountPowerValue>{powerPercent}%</AccountPowerValue>
                    </AccountPowerBlock>
                </AccountText>
            </AccountInfoBlock>
        );
    }

    renderNotificationsBlock() {
        const { freshCount, currentUsername } = this.props;
        const { isPadScreen, isNotificationsOpen } = this.state;

        return (
            <Link
                role="button"
                to={`/@${currentUsername}/activity`}
                aria-label={tt('aria_label.notifications', { count: freshCount })}
                onClick={this.onNotificationsMenuToggle}
            >
                <Notifications
                    mobile={isPadScreen ? 1 : 0}
                    active={isNotificationsOpen ? 1 : 0}
                    innerRef={this.notificationsRef}
                >
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

    renderMobileAccountBlock() {
        const { isPadScreen } = this.state;
        const { currentUsername, votingPower } = this.props;

        const angle = 2 * Math.PI - 2 * Math.PI * (votingPower / 100);

        const { x, y } = calcXY(angle);

        return (
            <Fragment>
                <MobileAccountBlock to={`/@${currentUsername}`} mobile={isPadScreen ? 1 : 0}>
                    <MobileAccountContainer innerRef={this.accountRef}>
                        <PowerCircle>
                            <svg viewBox="-1 -1 2 2">
                                <circle cx="0" cy="0" r="1" fill="#2879ff" />
                                <path
                                    d={`M ${x * -1} ${y} A 1 1 0 ${
                                        angle > Math.PI ? 1 : 0
                                    } 1 0 -1 L 0 0`}
                                    fill="#cde0ff"
                                />
                            </svg>
                        </PowerCircle>
                        <UserpicMobile
                            account={currentUsername}
                            size={44}
                            ariaLabel={tt('aria_label.avatar')}
                        />
                    </MobileAccountContainer>
                </MobileAccountBlock>
            </Fragment>
        );
    }

    renderLocaleBlock() {
        return (
            <LocaleSelectWrapper>
                <LocaleSelect onChangeLocale={this.props.onChangeLocale} />
            </LocaleSelectWrapper>
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
                            <LogoIcon mobile={isMobile ? 1 : 0} />
                            {isPadScreen ? null : <LogoText>GOLOS</LogoText>}
                        </LogoLink>
                        <SearchBlock
                            href="/static/search.html"
                            pad={isPadScreen ? 1 : 0}
                            mobile={isMobile ? 1 : 0}
                            aria-label={tt('g.search')}
                        >
                            {isPadScreen ? <FlexFiller /> : <SearchInput />}
                            <SearchIcon name="search" />
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
                                    {isMobile ? (
                                        <SignInMobile
                                            to="/login"
                                            aria-label={tt('g.login')}
                                            onClick={this.onLoginClick}
                                        >
                                            <Icon name="login-normal" width="17" height="18" />
                                        </SignInMobile>
                                    ) : (
                                        <SignIn to="/login" onClick={this.onLoginClick}>
                                            <Button light>{tt('g.login')}</Button>
                                        </SignIn>
                                    )}
                                </Buttons>
                            </Fragment>
                        )}
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
                                onClose={this.onMenuToggle}
                                accountName={currentUsername}
                                onLogoutClick={this.onLogoutClick}
                            />
                        </Popover>
                    ) : null}
                </Fixed>
                {isPadScreen ? null : <Filler />}
            </Root>
        );
    }
}
