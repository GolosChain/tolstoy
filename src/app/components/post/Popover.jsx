import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import Icon from 'golos-ui/Icon';

const Block = styled.div`
    width: 100%;
    border-bottom: 2px solid #e1e1e1;
    padding-bottom: 21px;
    padding-top: 17px;
`;

const Wrapper = styled.div`
    width: 300px;
    max-width: 100%;
    position: relative;
    padding: 8px 20px 20px;

    & ${Block}:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

const CloseButton = styled.div`
    width: 24px;
    height: 24px;
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    & svg {
        color: #e1e1e1;
    }

    &:hover svg {
        color: #b9b9b9;
    }
`;

class Popover extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    render() {
        const { className } = this.props;
        return (
            <Wrapper className={className}>
                <CloseButton onClick={this._closePopover}>
                    <Icon name="cross" width={16} height={16} />
                </CloseButton>
                <Block>header</Block>
                <Block>Posts</Block>
                <Block>buttons</Block>
            </Wrapper>
        );
    }

    _closePopover = e => {
        e.stopPropagation();
        this.props.close();
    };
}

export default Popover;
