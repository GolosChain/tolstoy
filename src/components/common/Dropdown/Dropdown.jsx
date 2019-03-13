import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import by from 'styled-by';

const AUTO_ALIGN_OFFSET = 150;

const Wrapper = styled.span`
  position: relative;
`;

const TargetWrapper = styled.span``;

const DialogWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  margin-top: 16px;
  transform: translateX(-50%);

  ${by('align', {
    left: `left: 0; transform: translateX(-3px);`,
    right: 'left: unset; right: 0; transform: translateX(3px);',
  })};
`;

const Dialog = styled.div`
  padding: 5px 0;
  border-radius: 8px;
  background: #fff;
  animation: from-up 0.2s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const Handle = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  top: 0;
  left: 50%;
  margin: -8px;
  background: #fff;
  box-shadow: -3px -3px 3px 0px rgba(0, 0, 0, 0.015);
  transform: rotate(45deg);

  ${by('align', {
    left: 'left: 23px',
    right: 'left: unset; right: 23px;',
  })};
`;

const Line = styled.div`
  padding: 6px 26px;
  font-size: 15px;
  white-space: nowrap;
  transition: background-color 0.15s;

  &:hover {
    background: #f0f0f0;
  }
`;

export default class Dropdown extends Component {
  state = {
    isOpen: false,
    align: null,
  };

  componentWillUnmount() {
    this._removeListeners();
  }

  render() {
    const { children, items, className } = this.props;
    const { isOpen, align } = this.state;

    const _items = items ? items.filter(i => i) : null;

    return (
      <Wrapper className={className} ref={this._onRef}>
        <TargetWrapper ref={this._onTargetRef} onClick={this._onWrapperClick}>
          {children}
        </TargetWrapper>
        {isOpen && _items && _items.length ? (
          <DialogWrapper align={align}>
            <Dialog>
              <Handle align={align} />
              {_items.map((item, i) => {
                const { title, Wrapper = Fragment, props } = item;

                return (
                  <Wrapper key={i} {...props}>
                    <Line onClick={e => this._onItemClick(e, item)}>{title}</Line>
                  </Wrapper>
                );
              })}
            </Dialog>
          </DialogWrapper>
        ) : null}
      </Wrapper>
    );
  }

  open() {
    const box = this._target.getBoundingClientRect();

    const x = box.left + box.width / 2;
    let align = 'center';

    if (x < AUTO_ALIGN_OFFSET) {
      align = 'left';
    } else if (x > window.innerWidth - AUTO_ALIGN_OFFSET) {
      align = 'right';
    }

    this.setState({
      isOpen: true,
      align,
    });

    if (!this._clickListing) {
      this._clickListing = true;
      window.addEventListener('mousedown', this._onAwayClick);
      window.addEventListener('click', this._onAwayClick);
    }
  }

  close() {
    this._removeListeners();

    this.setState({
      isOpen: false,
    });
  }

  _removeListeners() {
    if (this._clickListing) {
      window.removeEventListener('mousedown', this._onAwayClick);
      window.removeEventListener('click', this._onAwayClick);
      this._clickListing = false;
    }
  }

  _onRef = el => {
    this._root = el;
  };

  _onTargetRef = el => {
    this._target = el;
  };

  _onWrapperClick = () => {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  _onItemClick = (e, { dontCloseOnClick, onClick }) => {
    if (!dontCloseOnClick) {
      this.close();
    }

    if (onClick) {
      onClick(e);
    }
  };

  _onAwayClick = e => {
    if (!this._root.contains(e.target)) {
      this.close();
    }
  };
}
