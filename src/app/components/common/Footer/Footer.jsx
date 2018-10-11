import React, { PureComponent } from 'react';
import styled from 'styled-components';
import by from 'styled-by';
import tt from 'counterpart';
import { api } from 'golos-js';

import { TERMS_OF_SERVICE_URL } from 'app/client_config';
import { renderValue } from 'src/app/helpers/currency';

import Container from 'src/app/components/common/Container';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    border-top: 1px solid #e1e1e1;
`;

const FooterMenus = styled.div`
    display: flex;
    flex: 1;
    margin: 40px 0;
`;

const Menu = styled.div`
    &:not(last-child) {
        margin-right: 10px;
    }

    ${by('type', {
        payout: () => `
            @media (max-width: 950px) {
                order: 1;
            }
        `,
        links: () => `
            @media (max-width: 950px) {
                order: 0;
                flex: 1 1 100%;
                margin-bottom: 20px;
            }
        `,
        socials: () => `
            @media (max-width: 950px) {
                order: 2;
            }
        `,
        apps: () => `
            @media (max-width: 950px) {
                order: 3;
            }
        `,
    })};
`;

const MenuBlock = styled.div`
    display: flex;
    flex-direction: column;

    ${by('type', {
        links: () => `
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
        &:not(last-child) {
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
    color: #959595;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 16px;

    &:not(last-child) {
        margin-bottom: 20px;
    }

    &:hover {
        color: #606060;
    }

    ${by('type', {
        big: () => `
            color: #333333;
            font-size: 36px;
            line-height: 43px;

            &:hover {
                color: #333333;
            }
        `,
        icon: () => `
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
    state = {
        currentSupply: 0,
    };

    async componentDidMount() {
        const { pricePerGolos } = this.props;

        const result = await api.getDynamicGlobalProperties();
        this.setState({
            currentSupply: Math.floor(parseInt(result.current_supply) / pricePerGolos),
        });
    }

    render() {
        const { currentSupply } = this.state;

        return (
            <Wrapper>
                <FooterMenus>
                    <Container justify="space-between" wrap="wrap">
                        <Menu type="payout">
                            <MenuTitle>Всего выплачено</MenuTitle>
                            <MenuList>
                                <MenuItem href="https://explorer.golos.io" type="big">
                                    {renderValue(currentSupply, 'GBG', 'short')}
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Menu type="links">
                            <MenuTitle>Golos.io</MenuTitle>
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
                                </MenuList>
                            </MenuBlock>
                        </Menu>
                        <Menu type="socials">
                            <MenuTitle>Социальные сети</MenuTitle>
                            <MenuBlock>
                                <MenuIconList>
                                    <MenuItem
                                        href="https://www.facebook.com/www.golos.io"
                                        type="icon"
                                    >
                                        <Icon name="facebook" width={13} height={24} />
                                    </MenuItem>
                                    <MenuItem href="https://vk.com/goloschain" type="icon">
                                        <Icon name="vk" width={28} height={18} />
                                    </MenuItem>
                                    <MenuItem href="https://t.me/golos_support" type="icon">
                                        <Icon name="telegram" width={22} height={20} />
                                    </MenuItem>
                                </MenuIconList>
                                <MenuIconList>
                                    <MenuItem
                                        href="https://bitcointalk.org/index.php?topic=1624364.0"
                                        type="icon"
                                    >
                                        <Icon name="bitcointalk" size={26} />
                                    </MenuItem>
                                    <MenuItem href="#" type="icon">
                                        <Icon name="discord" width={20} height={22} />
                                    </MenuItem>
                                    <MenuItem type="icon" />
                                </MenuIconList>
                            </MenuBlock>
                        </Menu>
                        <Menu type="apps">
                            <MenuTitle>Приложения</MenuTitle>
                            <MenuIconList>
                                <MenuItem
                                    href="https://play.google.com/store/apps/details?id=io.golos.golos"
                                    type="icon"
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
                    <Container>© 2018 Golos.io</Container>
                </FooterCopyright>
            </Wrapper>
        );
    }
}
