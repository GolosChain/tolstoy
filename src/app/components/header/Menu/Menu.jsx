import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

const Ul = styled.ul`
    padding: 5px 0 6px;
    margin: 0;
`;

const Li = styled.li`
    list-style: none;
`;

const LinkStyled = styled(Link)`
    display: flex;
    align-items: center;
    height: 50px;
    padding-right: 20px;
    font-size: 14px;
    color: #333 !important;
    background-color: #fff;
    transition: background-color 0.15s;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 63px;
`;

const IconStyled = styled(Icon)`
    flex-shrink: 0;
    color: #393636;
`;

export default class Menu extends PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        accountName: PropTypes.string.isRequired,
        onLogoutClick: PropTypes.func.isRequired,
    };

    render() {
        const { accountName, onLogoutClick } = this.props;

        const items = [
            {
                link: `/@${accountName}/transfers`,
                icon: 'wallet2',
                text: tt('g.wallet'),
                width: 18,
                height: 18,
            },
            {
                link: '/market',
                icon: 'transfer',
                text: tt('userwallet_jsx.market'),
                width: 20,
                height: 16,
            },
            {
                link: '/~witnesses',
                icon: 'delegates',
                text: tt('navigation.delegates'),
                width: 22,
                height: 16,
            },
            {
                link: tt('link_to.telegram'),
                icon: 'technical-support',
                text: tt('navigation.technical_support'),
                width: 25,
                height: 26,
            },
            {
                link: `/@${accountName}/settings`,
                icon: 'settings',
                text: tt('g.settings'),
                width: 22,
                height: 22,
            },
            {
                icon: 'logout',
                text: tt('g.logout'),
                onClick: onLogoutClick,
                width: 18,
                height: 19,
            },
        ];

        return (
            <Ul>
                {items.map(({ link = '', target, icon, text, onClick, width, height }, i) => (
                    <Li key={i} onClick={this._onItemClick}>
                        <LinkStyled
                            to={link}
                            target={link.startsWith('//') ? 'blank' : null}
                            onClick={onClick}
                        >
                            <IconWrapper>
                                <IconStyled name={icon} width={width} height={height} />
                            </IconWrapper>
                            {text}
                        </LinkStyled>
                    </Li>
                ))}
            </Ul>
        );
    }

    _onItemClick = () => {
        this.props.onClose();
    };
}
