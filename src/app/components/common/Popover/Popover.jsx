import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import throttle from 'lodash/throttle';

const POPOVER_OFFSET = 25;

const Root = styled.div`
    position: absolute;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    animation: from-down 0.15s;
    z-index: 10;

    @keyframes from-down {
        from {
            opacity: 0;
            transform: translate3d(0, 10px, 0);
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
        }
    }
`;

const Pointer = styled.div`
    position: absolute;
    top: 0;
    left: 25px;
    margin-left: -8px;
    margin-top: -7px;
    width: 16px;
    height: 16px;
    transform: rotate(45deg);
    background: #fff;
    box-shadow: -3px -3px 4px 0 rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
    border-radius: 8px;
    background: #fff;
`;

export default class Popover extends PureComponent {
    state = {
        isOpen: this.props.isOpen || false,
        top: null,
        left: null,
    };

    componentDidMount() {
        this._mount = document.getElementById('content');

        if (this.state.isOpen) {
            this._addListeners();
        }
    }

    componentWillUnmount() {
        this._removeListeners();
    }

    render() {
        const { children } = this.props;
        const { isOpen, top } = this.state;

        return (
            <Fragment>
                <div ref={this._onRef} onClick={this._onTargetClick}>
                    {children}
                </div>
                {isOpen && top != null ? createPortal(this._renderPopover(), this._mount) : null}
            </Fragment>
        );
    }

    _renderPopover() {
        const { content } = this.props;
        const { top, left } = this.state;

        return (
            <Root innerRef={this._onPopoverRef} style={{ top, left }}>
                <Pointer />
                <Content>{content()}</Content>
            </Root>
        );
    }

    _addListeners() {
        if (!this._listen) {
            this._listen = true;
            window.addEventListener('scroll', this._doRepositionLazy);
            window.addEventListener('resize', this._doRepositionLazy);
            window.addEventListener('mousedown', this._onAwayClick);
            this._interval = setInterval(this._doReposition);
        }
    }

    _removeListeners() {
        if (this._listen) {
            window.removeEventListener('scroll', this._doRepositionLazy);
            window.removeEventListener('resize', this._doRepositionLazy);
            window.removeEventListener('mousedown', this._onAwayClick);
            clearInterval(this._interval);
            this._doRepositionLazy.cancel();

            this._listen = false;
        }
    }

    _onRef = el => {
        this._target = el;

        if (this.state.isOpen) {
            this._doReposition();
        }
    };

    _onPopoverRef = el => {
        this._popover = el;

        if (el && el.scrollIntoViewIfNeeded) {
            el.scrollIntoViewIfNeeded();
        }
    };

    _doReposition = () => {
        if (!this._target) {
            return;
        }

        const pos = this._target.getBoundingClientRect();
        const { scrollTop, scrollLeft } = document.scrollingElement || document.body;

        this.setState({
            top: Math.round(scrollTop + pos.top + pos.height + 8),
            left: Math.round(scrollLeft + pos.left + pos.width / 2 - POPOVER_OFFSET),
        });
    };

    _onTargetClick = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        });

        this._doReposition();
        this._addListeners();
    };

    _onAwayClick = el => {
        if (this._popover.contains(el.target) || this._target.contains(el.target)) {
            return;
        }

        this._removeListeners();

        this.setState({
            isOpen: false,
        });
    };

    _doRepositionLazy = throttle(this._doReposition, 50);
}
