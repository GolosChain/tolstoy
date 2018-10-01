import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import tt from 'counterpart';
import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import Userpic from 'app/components/elements/Userpic';
import AccountMenuDesktopWrapper from '../AccountMenuDesktopWrapper';
import MobilePopover from '../MobilePopover';
import AccountMenu from '../AccountMenu';
import Popover from '../Popover';
import Menu from '../Menu';
import user from 'app/redux/User';
import { REGISTRATION_URL } from 'app/client_config';

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

    ${is('mobile')`
        padding: 10px 20px;
    `};
`;

const NotifIcon = styled(Icon)`
    width: 22px;
    height: 22px;
    color: #393636;
`;

const NotifCounter = styled.div`
    margin-left: 10px;
    font-size: 18px;
    font-weight: 300;
    color: #757575;
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

@connect(
    state => {
        const myAccountName = state.user.getIn(['current', 'username']);

        let votingPower = null;

        if (myAccountName) {
            votingPower = state.global.getIn(['accounts', myAccountName, 'voting_power']) / 100;
        }

        return {
            myAccountName,
            votingPower,
            offchainAccount: state.offchain.get('account'),
        };
    },
    {
        onLogin: () => user.actions.showLogin(),
    }
)
export default class Header extends PureComponent {
    state = {
        isAccountOpen: false,
        isMenuOpen: false,
        waitAuth: this.props.offchainAccount && !this.props.myAccountName,
        isMobile: process.env.BROWSER ? window.innerWidth < MIN_MOBILE_WIDTH : false,
    };

    componentDidMount() {
        window.addEventListener('resize', this._onResizeLazy);

        if (this.state.waitAuth) {
            this._timeoutId = setTimeout(() => {
                this.setState({
                    waitAuth: false,
                });
            }, 2000);
        }
    }

    componentWillUnmount() {
        this._onResizeLazy.cancel();
        window.removeEventListener('resize', this._onResizeLazy);
        clearTimeout(this._timeoutId);
    }

    render() {
        const { myAccountName } = this.props;
        const { isMobile, isMenuOpen, waitAuth } = this.state;

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
                        {myAccountName ? (
                            this._renderAuthorizedPart()
                        ) : (
                            <Buttons hidden={waitAuth}>
                                <RegistrationLink to={REGISTRATION_URL}>
                                    <Button>{tt('g.sign_up')}</Button>
                                </RegistrationLink>
                                <LoginLink to="/login" onClick={this._onLoginClick}>
                                    <Button light>{tt('g.login')}</Button>
                                </LoginLink>
                            </Buttons>
                        )}
                        {isMobile ? null : (
                            <DotsWrapper innerRef={this._onDotsRef} onClick={this._onMenuClick}>
                                <Dots name="dots" />
                            </DotsWrapper>
                        )}
                    </Content>
                    {isMenuOpen ? (
                        <Popover target={this._dots} onClose={this._onMenuClose}>
                            <Menu onClose={this._onMenuClose} />
                        </Popover>
                    ) : null}
                </Fixed>
                {isMobile ? null : <Filler />}
            </Root>
        );
    }

    _renderAuthorizedPart() {
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
                {isMobile ? null : <Splitter />}
                {isMobile ? null : this._renderFullAccountBlock()}
                {isMobile ? null : <Splitter />}
                <Notifications mobile={isMobile ? 1 : 0}>
                    <NotifIcon name="bell" />
                    {isMobile ? null : <NotifCounter>18</NotifCounter>}
                </Notifications>
                {isMobile ? this._renderMobileAccountBlock() : null}
            </AuthorizedBlock>
        );
    }

    _renderFullAccountBlock() {
        const { myAccountName, votingPower } = this.props;
        const { isAccountOpen } = this.state;

        const powerPercent = formatPower(votingPower);

        return (
            <AccountInfoWrapper>
                <AccountInfoBlock onClick={this._onAccountClick}>
                    <Userpic account={myAccountName} size={36} />
                    <AccountText>
                        <AccountName>{myAccountName}</AccountName>
                        <AccountPowerBlock>
                            <AccountPowerLabel>Сила Голоса:</AccountPowerLabel>
                            <AccountPowerValue>{powerPercent}%</AccountPowerValue>
                        </AccountPowerBlock>
                    </AccountText>
                    <AccountPowerBar title={`Сила голоса: ${powerPercent}%`}>
                        <AccountPowerChunk fill={votingPower > 90 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 70 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 50 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 30 ? 1 : 0} />
                        <AccountPowerChunk fill={votingPower > 10 ? 1 : 0} />
                    </AccountPowerBar>
                </AccountInfoBlock>
                {isAccountOpen ? (
                    <AccountMenuDesktopWrapper onClose={this._onAccountMenuClose} />
                ) : null}
            </AccountInfoWrapper>
        );
    }

    _renderMobileAccountBlock() {
        const { myAccountName, votingPower } = this.props;
        const { isAccountOpen } = this.state;

        const angle = 2 * Math.PI - 2 * Math.PI * (votingPower / 100);

        const { x, y } = calcXY(angle);

        return (
            <Fragment>
                <MobileAccountBlock onClick={this._onAccountClick}>
                    <MobileAccountContainer innerRef={this._onAccountRef}>
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
                        <UserpicMobile account={myAccountName} size={44} />
                    </MobileAccountContainer>
                </MobileAccountBlock>
                {isAccountOpen ? (
                    <MobilePopover target={this._account} onClose={this._onAccountMenuClose}>
                        <AccountMenu onClose={this._onAccountMenuClose} />
                    </MobilePopover>
                ) : null}
            </Fragment>
        );
    }

    _onResizeLazy = throttle(() => {
        this.setState({
            isMobile: window.innerWidth < MIN_MOBILE_WIDTH,
        });
    }, 100);

    _onAccountRef = el => {
        this._account = el;
    };

    _onDotsRef = el => {
        this._dots = el;
    };

    _onAccountClick = () => {
        this.setState({
            isAccountOpen: !this.state.isAccountOpen,
        });
    };

    _onAccountMenuClose = () => {
        this.setState({
            isAccountOpen: false,
        });
    };

    _onMenuClick = () => {
        this.setState({
            isMenuOpen: !this.state.isMenuOpen,
        });
    };

    _onMenuClose = () => {
        this.setState({
            isMenuOpen: false,
        });
    };

    _onLoginClick = e => {
        e.preventDefault();

        this.props.onLogin();
    };
}

function formatPower(percent) {
    return percent.toFixed(2).replace(/\.?0+$/, '');
}

function calcXY(angle) {
    return {
        x: Math.sin(angle),
        y: -Math.cos(angle),
    };
}
