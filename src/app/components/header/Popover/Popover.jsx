import React, { PureComponent } from 'react';
import styled from 'styled-components';

const POPOVER_OFFSET = 39;

const Root = styled.div`
    position: absolute;
    top: 56px;
    right: ${({ right }) => right}px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    z-index: 2;
    animation: fade-in 0.15s;
`;

const Arrow = styled.div`
    position: absolute;
    width: 18px;
    height: 18px;
    top: -9px;
    right: 15px;
    background: #fff;
    box-shadow: -3px -3px 3px 0px rgba(0, 0, 0, 0.015);
    transform: rotate(45deg);
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
`;

export default class Popover extends PureComponent {
    componentDidMount() {
        window.addEventListener('mousedown', this._onAwayClick);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this._onAwayClick);
    }

    render() {
        const { target, children } = this.props;

        const box = target.getBoundingClientRect();
        const right = window.innerWidth - Math.round(box.left + box.width / 2) - POPOVER_OFFSET;

        return (
            <Root innerRef={this._onRef} right={right}>
                <Arrow />
                <Content>{children}</Content>
            </Root>
        );
    }

    _onRef = el => {
        this._root = el;
    };

    _onAwayClick = e => {
        const { target } = this.props;

        if (this._root && !this._root.contains(e.target) && !target.contains(e.target)) {
            this.props.onClose();
        }
    };
}
