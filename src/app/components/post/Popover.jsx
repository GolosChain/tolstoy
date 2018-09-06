import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import is from 'styled-is';
import Icon from 'golos-ui/Icon';

const Wrapper = styled.div`
    width: 300px;
    max-width: 100%;
    height: 100px;
    position: relative;
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
            </Wrapper>
        );
    }

    _closePopover = e => {
        e.stopPropagation();
        this.props.close();
    };
}

export default Popover;
