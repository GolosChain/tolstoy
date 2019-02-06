import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import by from 'styled-by';
import tt from 'counterpart';

import { APP_NAME_UP, GOLOS_EXPLORER, TERMS_OF_SERVICE_URL } from 'app/client_config';

import CurrencyValue from 'src/app/components/common/CurrencyValue';
import Container from 'src/app/components/common/Container';
import Icon from 'golos-ui/Icon';
import { logOutboundLinkClickAnalytics } from 'src/app/helpers/gaLogs';

const Wrapper = styled.div`
    border-top: 1px solid #e1e1e1;
`;

const FooterMenus = styled.div`
    display: flex;
    flex: 1;
    margin: 40px 0;
`;

const Menu = styled.div`
    &:not(:last-child) {
        margin-right: 10px;
    }

    @media (max-width: 950px) {
        ${by('type', {
            payout: `
                order: 1;
            `,
            links: `
                order: 0;
                flex: 1 1 100%;
                margin-bottom: 20px;
            `,
            socials: `
                order: 2;
            `,
            apps: `
                order: 3;
            `,
        })};
    }
`;

const MenuBlock = styled.div`
    display: flex;
    flex-direction: column;

    ${by('type', {
        links: `
            flex-direction: row;

            @media (max-width: 500px) {
                flex-direction: column;
            }
        `,
    })};
`;

const MenuList = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: 500px) {
        &:not(:last-child) {
            margin-right: 50px;
        }
    }

    @media (max-width: 500px) {
        flex: 1;
        margin-right: 0;
    }
`;

const MenuIconList = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const MenuItem = styled.a`
    display: flex;
    margin-bottom: 20px;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 16px;
    color: #959595;

    &:hover {
        color: #606060;
    }

    &:focus {
        color: #333333;
    }

    ${by('type', {
        big: `
            color: #333333;
            font-size: 36px;
            line-height: 43px;

            &:hover {
                color: #333333;
            }
        `,
        icon: `
            color: #333333;
            flex-basis: 23px;

            &:hover {
                color: #2879ff;
            }
        `,
    })};
`;

const MenuTitle = styled.div`
    margin-bottom: 25px;
    color: #393636;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    text-transform: uppercase;
`;

const FooterCopyright = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    height: 58px;
    border-top: 1px solid #e1e1e1;

    color: #333333;
    font-family: Roboto;
    font-size: 18px;
    font-weight: 300;
    line-height: 18px;
`;

export default class Footer extends PureComponent {
    static propTypes = {
        currentSupply: PropTypes.string,
    };

    render() {
        const { currentSupply } = this.props;
        const currentYear = new Date().getFullYear();

        return (
            <Wrapper>
                <FooterMenus>
                    <Container justify="space-between" wrap="wrap">
                        <Menu type="payout">
                            <MenuTitle>{tt('footer.total_paid')}</MenuTitle>
                            <MenuList aria-label={tt('aria_label.total_paid')}>
                                <MenuItem href={GOLOS_EXPLORER} type="big" target="_blank">
                                    <CurrencyValue value={currentSupply} decimals="short" />
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Menu type="links">
                            <MenuTitle>{APP_NAME_UP}</MenuTitle>
                            <MenuBlock type="links">
                                <MenuList>
                                    <MenuItem href="/welcome">{tt('navigation.welcome')}</MenuItem>
                                    <MenuItem href="/faq">{tt('navigation.faq')}</MenuItem>
                                    <MenuItem href="/@golosio">{tt('g.golos_fest')}</MenuItem>
                                    {/* <MenuItem>Подписка на рассылку</MenuItem> */}
                                    <MenuItem href="/about#team">{tt('g.team')}</MenuItem>
                                </MenuList>
                                <MenuList>
                                    <MenuItem href="/submit?type=submit_feedback">
                                        {tt('navigation.feedback')}
                                    </MenuItem>
                                    <MenuItem href="/ru--konfidenczialxnostx/@golos/politika-konfidencialnosti">
                                        {tt('navigation.privacy_policy')}
                                    </MenuItem>
                                    <MenuItem href={TERMS_OF_SERVICE_URL}>
                                        {tt('navigation.terms_of_service')}
                                    </MenuItem>
                                    <MenuItem href={GOLOS_EXPLORER} target="_blank">
                                        Golos Explorer
                                    </MenuItem>
                                </MenuList>
                            </MenuBlock>
                        </Menu>
                        <Menu type="socials">
                            <MenuTitle>{tt('footer.social_networks')}</MenuTitle>
                            <MenuBlock>
                                <MenuIconList>
                                    <MenuItem
                                        aria-label={tt('aria_label.facebook_link')}
                                        href="https://www.facebook.com/www.golos.io"
                                        type="icon"
                                        target="_blank"
                                        rel="noopener norefferer"
                                        onClick={() =>
                                            logOutboundLinkClickAnalytics(
                                                'https://www.facebook.com/www.golos.io'
                                            )
                                        }
                                    >
                                        <Icon name="facebook" width={13} height={24} />
                                    </MenuItem>
                                    <MenuItem
                                        aria-label={tt('aria_label.vk_link')}
                                        href="https://vk.com/goloschain"
                                        type="icon"
                                        target="_blank"
                                        rel="noopener norefferer"
                                        onClick={() =>
                                            logOutboundLinkClickAnalytics(
                                                'https://vk.com/goloschain'
                                            )
                                        }
                                    >
                                        <Icon name="vk" width={28} height={18} />
                                    </MenuItem>
                                    <MenuItem
                                        aria-label={tt('aria_label.telegram_link')}
                                        href="https://tlg.name/golos_support"
                                        type="icon"
                                        target="_blank"
                                        rel="noopener norefferer"
                                        onClick={() =>
                                            logOutboundLinkClickAnalytics(
                                                'https://tlg.name/golos_support'
                                            )
                                        }
                                    >
                                        <Icon name="telegram" width={22} height={20} />
                                    </MenuItem>
                                </MenuIconList>
                                <MenuIconList>
                                    <MenuItem
                                        aria-label={tt('aria_label.bitcoin_link')}
                                        href="https://bitcointalk.org/index.php?topic=1624364.0"
                                        type="icon"
                                        target="_blank"
                                        rel="noopener norefferer"
                                        onClick={() =>
                                            logOutboundLinkClickAnalytics(
                                                'https://bitcointalk.org/index.php?topic=1624364.0'
                                            )
                                        }
                                    >
                                        <Icon name="bitcointalk" size={26} />
                                    </MenuItem>
                                    <MenuItem type="icon" />
                                    {/* <MenuItem href="#" type="icon">
                                        <Icon name="discord" width={20} height={22} />
                                    </MenuItem> */}
                                    <MenuItem type="icon" />
                                </MenuIconList>
                            </MenuBlock>
                        </Menu>
                        <Menu type="apps">
                            <MenuTitle>{tt('footer.mobile_apps')}</MenuTitle>
                            <MenuIconList>
                                <MenuItem
                                    aria-label={tt('aria_label.android_link')}
                                    href="https://play.google.com/store/apps/details?id=io.golos.golos"
                                    type="icon"
                                    target="_blank"
                                    rel="noopener norefferer"
                                    onClick={() =>
                                        logOutboundLinkClickAnalytics(
                                            'https://play.google.com/store/apps/details?id=io.golos.golos'
                                        )
                                    }
                                >
                                    <Icon name="android" width={26} height={30} />
                                </MenuItem>
                                {/* <MenuItem href="#" type="icon">
                                    <Icon name="ios" width={23} height={30} />
                                </MenuItem> */}
                            </MenuIconList>
                        </Menu>
                    </Container>
                </FooterMenus>
                <FooterCopyright>
                    <Container>{`© 2016 - ${currentYear} Golos.io`}</Container>
                </FooterCopyright>
            </Wrapper>
        );
    }
}
