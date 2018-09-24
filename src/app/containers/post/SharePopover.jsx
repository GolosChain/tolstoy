import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import is from 'styled-is';

import Icon from 'golos-ui/Icon';

import { sharePopoverSelector } from 'src/app/redux/selectors/post/sharePopoverSelector';

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

@connect(sharePopoverSelector)
export default class SharePopover extends Component {
    static propTypes = {
        horizontal: PropTypes.bool,
    };

    static defaultProps = {
        horizontal: false,
    };

    render() {
        const { shareMenu, horizontal } = this.props;
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
