import React, { PureComponent } from 'react';
import throttle from 'lodash/throttle';
import styled from 'styled-components';

const POPOVER_OFFSET = 14;

const Root = styled.div`
    position: absolute;
    top: 60px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    z-index: 2;
    animation: fade-in 0.15s;
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    
    min-width: 180px;
`;

export default class Popover extends PureComponent {
    state = {
        right: this._calcRight(),
    };

    componentDidMount() {
        window.addEventListener('mousedown', this._onAwayClick);
        window.addEventListener('click', this._onAwayClick);
        window.addEventListener('resize', this._onResizeLazy);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this._onAwayClick);
        window.removeEventListener('click', this._onAwayClick);
        window.removeEventListener('resize', this._onResizeLazy);
        this._onResizeLazy.cancel();
    }

    render() {
        const { children } = this.props;
        const { right } = this.state;

        return (
            <Root innerRef={this._onRef} style={{ right }}>
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

    _calcRight() {
        const { target } = this.props;

        if (!target) {
            return 0;
        }

        const box = target.getBoundingClientRect();
        return document.body.clientWidth - Math.round(box.left + box.width / 2) - POPOVER_OFFSET;
    }

    _onResize = () => {
        this.setState({
            right: this._calcRight(),
        });
    };

    _onResizeLazy = throttle(this._onResize, 50);
}
