import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

import { fbShare, ljShare, twitterShare, vkShare } from 'src/app/helpers/shareSocNetworks';

const Wrapper = styled.div`
    ${is('horizontal')`
        display: flex;
    `};
`;

const ItemContainer = styled.div`
    display: flex;
    padding: 18px;
    cursor: pointer;

    &[type='button'] {
        -webkit-appearance: none;
    }

    &:hover {
        color: #2879ff;
    }
`;

export default class SharePopover extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
        horizontal: PropTypes.bool,
    };

    static defaultProps = {
        horizontal: false,
    };

    render() {
        const { horizontal, post } = this.props;
        const shareMenu = [
            {
                link: '#',
                onClick: e => ljShare(e, post),
                value: 'LJ',
                title: tt('postfull_jsx.share_on_lj'),
                icon: 'lj',
                label: tt('aria_label.share_on_lj'),
            },
            {
                link: '#',
                onClick: e => vkShare(e, post),
                value: 'VK',
                title: tt('postfull_jsx.share_on_vk'),
                icon: 'vk',
                label: tt('aria_label.share_on_vk'),
            },
            {
                link: '#',
                onClick: e => fbShare(e, post),
                value: 'Facebook',
                title: tt('postfull_jsx.share_on_facebook'),
                icon: 'facebook',
                label: tt('aria_label.share_on_facebook'),
            },
            {
                link: '#',
                onClick: e => twitterShare(e, post),
                value: 'Twitter',
                title: tt('postfull_jsx.share_on_twitter'),
                icon: 'twitter',
                label: tt('aria_label.share_on_twitter'),
            },
        ];
        return (
            <Wrapper horizontal={horizontal}>
                {shareMenu.map(item => (
                    <ItemContainer
                        type="button"
                        aria-label={item.label}
                        key={item.value}
                        onClick={item.onClick}
                    >
                        <Icon name={item.icon} />
                    </ItemContainer>
                ))}
            </Wrapper>
        );
    }
}
