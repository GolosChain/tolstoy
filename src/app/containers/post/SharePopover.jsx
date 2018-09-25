import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

import { currentPostSelector } from 'src/app/redux/selectors/post/commanPost';
import { fbShare, ljShare, twitterShare, vkShare } from 'src/app/helpers/socialNetworksShare';

const Wrapper = styled.div`
    ${is('horizontal')`
        display: flex;
    `};
`;

const ItemContainer = styled.div`
    padding: 18px;
    cursor: pointer;

    &:hover {
        color: #2879ff;
    }
`;

@connect(currentPostSelector)
export default class SharePopover extends Component {
    static propTypes = {
        horizontal: PropTypes.bool,
    };

    static defaultProps = {
        horizontal: false,
    };

    render() {
        const { horizontal } = this.props;
        const shareMenu = [
            {
                link: '#',
                onClick: e => ljShare(e, post),
                value: 'LJ',
                title: tt('postfull_jsx.share_on_lj'),
                icon: 'lj',
            },
            {
                link: '#',
                onClick: e => vkShare(e, post),
                value: 'VK',
                title: tt('postfull_jsx.share_on_vk'),
                icon: 'vk',
            },
            {
                link: '#',
                onClick: e => fbShare(e, post),
                value: 'Facebook',
                title: tt('postfull_jsx.share_on_facebook'),
                icon: 'facebook',
            },
            {
                link: '#',
                onClick: e => twitterShare(e, post),
                value: 'Twitter',
                title: tt('postfull_jsx.share_on_twitter'),
                icon: 'twitter',
            },
        ];
        return (
            <Wrapper horizontal={horizontal}>
                {shareMenu.map(item => (
                    <ItemContainer onClick={item.onClick} key={item.value}>
                        <Icon name={item.icon} />
                    </ItemContainer>
                ))}
            </Wrapper>
        );
    }
}
