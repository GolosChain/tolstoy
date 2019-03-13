import React, { PureComponent, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import { getScrollElement } from 'src/helpers/window';

const POPOVER_OFFSET = 25;
const POINTER_HEIGHT = 10;
const POPOVER_VERTICAL_OFFSET = POINTER_HEIGHT + 1;
const MINIMAL_SPACE = 160;

const Root = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  z-index: 10;

  animation: from-down 0.15s;

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

const Wrapper = styled.div`
  position: absolute;
  min-width: 100px;
  width: max-content;
  max-width: 90vw;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);

  ${is('center')`
        transform: translateX(-50%);
    `};

  ${is('up')`
        bottom: 0;
    `};
`;

const Pointer = styled.div`
  position: absolute;
  top: 0;
  margin: -7px -8px;
  width: 16px;
  height: 16px;
  transform: rotate(45deg);
  background: #fff;
  box-shadow: -3px -3px 4px 0 rgba(0, 0, 0, 0.05);

  ${is('up')`
        top: unset;
        bottom: 0;
        box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.05);
    `};
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
    toUp: false,
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
    const { top, left, align, pointerStyle, toUp } = this.state;

    const wrapperStyle = {};

    let center;

    if (align === 'left') {
      wrapperStyle.left = 0;
    } else if (align === 'right') {
      wrapperStyle.right = 0;
    } else {
      center = true;
    }

    return (
      <Root style={{ top, left }}>
        <Wrapper style={wrapperStyle} center={center} up={toUp} ref={this._onPopoverRef}>
          <Pointer up={toUp} style={pointerStyle} />
          <Content>{content()}</Content>
        </Wrapper>
      </Root>
    );
  }

  _addListeners() {
    if (!this._listen) {
      this._listen = true;
      window.addEventListener('scroll', this._doRepositionLazy);
      window.addEventListener('resize', this._doRepositionLazy);
      window.addEventListener('mousedown', this._onAwayClick);
      this._interval = setInterval(this._doReposition, 1000);
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

    if (el) {
      // Force browser reflow
      const unused = el.clientWidth;

      this._doReposition();

      if (el && el.scrollIntoViewIfNeeded) {
        el.scrollIntoViewIfNeeded();
      }
    }
  };

  _doReposition = () => {
    if (!this._target) {
      return;
    }

    const { up } = this.props;

    const pointerStyle = {};

    const target = this._target.getBoundingClientRect();

    const toUp =
      (up && target.top > MINIMAL_SPACE) ||
      target.top + target.height > window.innerHeight - MINIMAL_SPACE;

    const { scrollTop, scrollLeft } = getScrollElement();

    const x = scrollLeft + target.left + target.width / 2;

    const shift = toUp ? -POPOVER_VERTICAL_OFFSET : target.height + POPOVER_VERTICAL_OFFSET;

    const top = Math.round(scrollTop + target.top + shift);

    if (this._popover) {
      const box = this._popover.getBoundingClientRect();

      const screenWidth = document.body.clientWidth;

      if (this._forced === 'center' || box.width > screenWidth * 0.9) {
        const pointerX = (x - 0.05 * screenWidth) / (screenWidth * 0.9);

        const minX = (POPOVER_OFFSET * 0.5) / (screenWidth * 0.9);

        const realX = Math.max(minX, Math.min(1 - minX, pointerX));

        pointerStyle.left = `${realX * 100}%`;

        this._forced = 'center';
        this.setState({
          top,
          left: Math.floor(screenWidth / 2),
          align: 'center',
          pointerStyle,
        });
        return;
      }

      if (this._forced === 'left' || box.left < screenWidth * 0.05) {
        pointerStyle.left = x - screenWidth * 0.05;

        this._forced = 'left';
        this.setState({
          top,
          left: screenWidth * 0.05,
          align: 'left',
          pointerStyle,
        });
        return;
      }

      if (this._forced === 'right' || box.right > screenWidth * 0.95) {
        pointerStyle.right = screenWidth - x - screenWidth * 0.05;

        this._forced = 'right';
        this.setState({
          top,
          left: screenWidth * 0.95,
          align: 'right',
          pointerStyle,
        });
        return;
      }
    }

    const xPart = x / document.body.clientWidth;

    let left = Math.round(x);
    let align;

    if (xPart < 0.2) {
      align = 'left';
      left -= POPOVER_OFFSET;
      pointerStyle.left = POPOVER_OFFSET;
    } else if (xPart > 0.8) {
      align = 'right';
      left += POPOVER_OFFSET;
      pointerStyle.right = POPOVER_OFFSET;
    } else {
      align = 'center';
      pointerStyle.left = '50%';
    }

    this.setState({
      top,
      left,
      align,
      pointerStyle,
      toUp,
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

    this.close();
  };

  close() {
    this._removeListeners();

    this._forced = null;

    this.setState({
      isOpen: false,
      top: null,
      left: null,
      align: null,
      pointerStyle: null,
    });
  }

  _doRepositionLazy = throttle(this._doReposition, 50);
}
