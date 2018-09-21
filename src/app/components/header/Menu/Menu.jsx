import React, { PureComponent } from 'react';
import { Link } from 'react-router';
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
    padding: 0 32px 0 28px;
    font-size: 14px;
    color: #333 !important;
    background-color: #fff;
    transition: background-color 0.15s;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const IconStyled = styled(Icon)`
    width: 20px;
    height: 20px;
    margin-right: 20px;
    color: #393636;
`;

export default class Menu extends PureComponent {
    render() {
        const items = [
            {
                link: '/welcome',
                icon: 'hand',
                text: tt('navigation.welcome'),
            },
            {
                link: '//wiki.golos.io/',
                icon: 'wiki',
                text: tt('navigation.wiki'),
            },
            {
                link: '/market',
                icon: 'transfer',
                text: tt('userwallet_jsx.market'),
            },
            {
                link: '/~witnesses',
                icon: 'delegates',
                text: tt('navigation.delegates'),
            },
            {
                link: '//golostools.com/',
                icon: 'apps',
                text: tt('navigation.app_center'),
            },
        ];

        return (
            <Ul>
                {items.map(({ link, target, icon, text }, i) => (
                    <Li key={i}>
                        <LinkStyled to={link} target={link.startsWith('//') ? 'blank' : null}>
                            <IconStyled name={icon} />
                            {text}
                        </LinkStyled>
                    </Li>
                ))}
            </Ul>
        );
    }
}
