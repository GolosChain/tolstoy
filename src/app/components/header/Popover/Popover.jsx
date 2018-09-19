import React, { PureComponent } from 'react';
import styled from 'styled-components';

const Root = styled.div`
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1;
`;

const Shadow = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    overflow: hidden;
    
    &:after {
        position: absolute;
        content: '';
        top: 0;
        left: -20px;
        right: -20px;
        height: 40px;
        box-shadow: inset 0 0 18px 4px rgba(0, 0, 0, 0.05);
    }
`;

const Arrow = styled.div`
    position: relative;
    width: 18px;
    height: 18px;
    margin-top: -18px;
    margin-left: -9px;
    border: 9px solid transparent;
    border-bottom-color: #f5f5f5;
    transform: translateX(${({ left }) => left}px);
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
        const left = Math.round(box.left + box.width / 2);

        return (
            <Root innerRef={this._onRef}>
                <Shadow />
                <Arrow left={left} />
                {children}
            </Root>
        );
    }

    _onRef = el => {
        this._root = el;
    };

    _onAwayClick = e => {
        if (this._root && !this._root.parentNode.contains(e.target)) {
            this.props.onClose();
        }
    };
}
