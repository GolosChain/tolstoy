import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import tt from 'counterpart';
import Icon from 'app/components/elements/Icon';
import user from 'app/redux/User';

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
    width: 24px;
    margin-right: 20px;
    overflow: hidden;
`;

const IconStyled = styled(Icon)`
    transition: fill 0.15s, color 0.15s;
`;

const LinkStyled = styled(Link)`
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 10px 0 37px;
    font-size: 14px;
    color: #333 !important;
    background-color: #fff;
    transition: background-color 0.15s;

    &:hover {
        background-color: #f0f0f0;
    }

    &:hover ${IconStyled} {
        color: #3f46ad;
        fill: #3f46ad;
    }
`;

@connect(
    state => {
        const myAccountName = state.user.getIn(['current', 'username']);

        return {
            myAccountName,
        };
    },
    {
        onShowMessagesClick: () => user.actions.showMessages(),
        onLogoutClick: () => user.actions.logout(),
    }
)
export default class AccountMenu extends PureComponent {
    render() {
        const { myAccountName, onShowMessagesClick, onLogoutClick } = this.props;

        let user_menu = [
            {
                link: `/@${myAccountName}/feed`,
                icon: 'new/home',
                iconSize: '1_5x',
                value: tt('g.feed'),
            },
            { link: `/@${myAccountName}`, icon: 'new/blogging', value: tt('g.blog') },
            { link: `/@${myAccountName}/comments`, icon: 'new/comment', value: tt('g.comments') },
            $STM_Config.is_sandbox
                ? {
                      icon: 'chatboxes',
                      value: tt('g.messages'),
                      onClick: onShowMessagesClick,
                  }
                : null,
            {
                link: `/@${myAccountName}/recent-replies`,
                icon: 'new/answer',
                value: tt('g.replies'),
            },
            { link: `/@${myAccountName}/favorites`, icon: 'new/star', value: tt('g.favorites') },
            { link: `/@${myAccountName}/transfers`, icon: 'new/wallet', value: tt('g.wallet') },
            { link: `/@${myAccountName}/settings`, icon: 'new/setting', value: tt('g.settings') },
            { icon: 'new/logout', value: tt('g.logout'), onClick: onLogoutClick },
        ];

        user_menu = user_menu.filter(item => item);

        return (
            <Ul>
                {user_menu.map(({ link, icon, iconSize, value, onClick }, i) => (
                    <Li key={i}>
                        <LinkStyled href={link} onClick={onClick}>
                            <IconWrapper>
                                <IconStyled name={icon} size={iconSize || '1_25x'} />
                            </IconWrapper>
                            {value}
                        </LinkStyled>
                    </Li>
                ))}
            </Ul>
        );
    }
}
