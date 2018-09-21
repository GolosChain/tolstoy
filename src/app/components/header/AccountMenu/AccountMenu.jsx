import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import tt from 'counterpart';
import Icon from 'golos-ui/Icon';
import user from 'app/redux/User';
import { getAccountPrice } from 'src/app/redux/selectors/account/accountPrice';
import { formatCurrency } from 'src/app/helpers/currency';

const PriceBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-bottom: 1px solid #e1e1e1;
    font-size: 14px;
    color: #333;
`;

const Price = styled.span`
    font-weight: 500;
`;

const Ul = styled.ul`
    padding: 5px 0 6px;
    margin: 0;
`;

const Li = styled.li`
    list-style: none;
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 26px;
    margin-right: 20px;
`;

const LinkStyled = styled(Link)`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 10px 0 34px;
    font-size: 14px;
    color: #333 !important;
    background-color: #fff;
    transition: background-color 0.15s;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const IconStyled = styled(Icon)`
    color: #393636;
    fill: #393636;
`;

@connect(
    state => {
        const myAccountName = state.user.getIn(['current', 'username']);

        const { price, currency } = getAccountPrice(state, myAccountName);

        return {
            myAccountName,
            price,
            currency,
        };
    },
    {
        onShowMessagesClick: () => user.actions.showMessages(),
        onLogoutClick: () => user.actions.logout(),
    }
)
export default class AccountMenu extends PureComponent {
    render() {
        const { myAccountName, price, currency, onShowMessagesClick, onLogoutClick } = this.props;

        let items = [
            {
                link: `/@${myAccountName}/feed`,
                icon: 'home',
                text: tt('g.feed'),
                size: 26,
            },
            {
                link: `/@${myAccountName}`,
                icon: 'blog',
                text: tt('g.blog'),
                size: 20,
            },
            {
                link: `/@${myAccountName}/comments`,
                icon: 'comment',
                text: tt('g.comments'),
                size: 21,
            },
            {
                link: `/@${myAccountName}/recent-replies`,
                icon: 'comment-reply',
                text: tt('g.replies'),
                size: 25,
                style: {
                    transform: 'translateX(2px)',
                },
            },
            $STM_Config.is_sandbox
                ? {
                      icon: 'messanger',
                      text: tt('g.messages'),
                      onClick: onShowMessagesClick,
                      size: 21,
                  }
                : null,
            {
                link: `/@${myAccountName}/favorites`,
                icon: 'star',
                text: tt('g.favorites'),
                size: 23,
            },
            {
                link: `/@${myAccountName}/transfers`,
                icon: 'wallet2',
                text: tt('g.wallet'),
                size: 20,
            },
            {
                link: `/@${myAccountName}/settings`,
                icon: 'settings',
                text: tt('g.settings'),
                size: 24,
            },
            {
                icon: 'logout',
                text: tt('g.logout'),
                onClick: onLogoutClick,
                size: 20,
            },
        ];

        items = items.filter(item => item);

        const priceString = formatCurrency(price, currency, 'adaptive');

        return (
            <Fragment>
                <PriceBlock>
                    <div>
                        Баланс: <Price>{priceString}</Price>
                    </div>
                </PriceBlock>
                <Ul>
                    {items.map(({ link, icon, text, size, style, onClick }, i) => (
                        <Li key={i}>
                            <LinkStyled to={link} onClick={onClick}>
                                <IconWrapper>
                                    <IconStyled name={icon} size={size || 22} style={style} />
                                </IconWrapper>
                                {text}
                            </LinkStyled>
                        </Li>
                    ))}
                </Ul>
            </Fragment>
        );
    }
}
