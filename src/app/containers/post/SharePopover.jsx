import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sharePopoverSelector } from 'src/app/redux/selectors/post/sharePopoverSelector';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div``;

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
        children: PropTypes.any,
    };

    render() {
        const { shareMenu } = this.props;
        return (
            <Wrapper>
                {shareMenu.map(item => (
                    <ItemContainer onClick={item.onClick} key={item.value}>
                        <Icon name={item.icon} />
                    </ItemContainer>
                ))}
            </Wrapper>
        );
    }
}
