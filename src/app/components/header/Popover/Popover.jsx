import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    position: absolute;
    top: 100%;
    right: 50%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    transform: translate(24px, 10px);
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
    width: max-content;
    max-width: 90vw;
    z-index: 1;
`;

export default class Popover extends PureComponent {
    componentDidMount() {
        this._listenTimeout = setTimeout(() => {
            window.addEventListener('mousedown', this._onAwayClick);
            window.addEventListener('click', this._onAwayClick);
        }, 10);
    }

    componentWillUnmount() {
        clearTimeout(this._listenTimeout);
        clearTimeout(this._closeTimeout);
        window.removeEventListener('mousedown', this._onAwayClick);
        window.removeEventListener('click', this._onAwayClick);
    }

    render() {
        const { children } = this.props;

        return (
            <Root innerRef={this._onRef}>
                <Arrow />
                <Content>{children}</Content>
            </Root>
        );
    }

    _onRef = el => {
        this._root = el;
    };

    _onAwayClick = e => {
        if (this._root && !this._root.contains(e.target)) {
            this._closeTimeout = setTimeout(() => {
                this.props.onClose();
            }, 50);
        }
    };
}
