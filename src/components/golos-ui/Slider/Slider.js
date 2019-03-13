import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { checkMobileDevice } from 'src/helpers/browser';

const Progress = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: ${({ width }) => width}%;
  height: 2px;
  border-radius: 1px;
  background: #2879ff;
`;

const HandleSlot = styled.div`
  position: relative;
  margin: 0 11px;
`;

const HandleWrapper = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;

  padding: 5px;
  margin: -5px 0 0 -16px;
`;

const Handle = styled.div`
  width: 22px;
  height: 22px;

  line-height: 22px;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  color: #ffffff;

  border: 1px solid #2879ff;
  border-radius: 50%;

  background: #2879ff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25);

  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;
  overflow: hidden;
`;

const Captions = styled.div`
  position: relative;
  display: flex;
  top: 32px;
  line-height: 1;
  font-size: 12px;
  color: #959595;
`;

const Caption = styled.div`
    flex: 1;

    ${is('left')`
        text-align: left;
    `}
    ${is('center')`
        text-align: center;
    `}
    ${is('right')`
        text-align: right;
    `}
`;

const Wrapper = styled.div`
  position: relative;
  height: ${({ showCaptions }) => (showCaptions ? 50 : 22)}px;
  user-select: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  ${is('disabled')`
        cursor: default;
        
        ${Progress} {
            background: #8e8e8e;
        }
        
        ${Handle} {
            border-color: #8e8e8e;
            background: #8e8e8e;
            cursor: default;
        }
    `};

  &:before {
    position: absolute;
    content: '';
    top: 10px;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 1px;
    background: #e1e1e1;
  }

  ${is('red')`
        ${Progress} {
            background: #ff4e00;
        }

        ${Handle} {
            background: #ff4e00 !important;
            border-color: #ff4e00 !important;
        }
    `};
`;

export default class Slider extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    red: PropTypes.bool,
    showCaptions: PropTypes.bool,
    percentsInCaption: PropTypes.bool,
    hideHandleValue: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: 0,
    min: 0,
    max: 100,
    showCaptions: false,
    percentsInCaption: false,
    hideHandleValue: false,
  };

  rootRef = createRef();

  componentWillUnmount() {
    this.removeListeners();
  }

  render() {
    const {
      min,
      max,
      hideHandleValue,
      showCaptions,
      disabled,
      percentsInCaption,
      ...passProps
    } = this.props;
    const value = Number(this.props.value);

    const isMobile = checkMobileDevice();
    const percent = (100 * (value - min)) / (max - min) || 0;

    let leftCaption = min;
    let centralCaption = Math.round(min + (max - min) / 2);
    let rightCaption = max;
    const tooltipPercents = `${Math.round((100 * value) / max)}%`;
    if (percentsInCaption) {
      leftCaption = 0;
      centralCaption = 50;
      rightCaption = 100;
    }

    return (
      <Wrapper
        {...passProps}
        showCaptions={showCaptions}
        disabled={disabled}
        onClick={disabled ? null : this.onClick}
        onMouseDown={disabled ? null : this.onMouseDown}
        onTouchStart={disabled ? null : this.onTouchStart}
      >
        <Progress width={percent} />
        <HandleSlot ref={this.rootRef}>
          <HandleWrapper left={percent}>
            {hideHandleValue && !isMobile ? (
              <Handle
                data-tooltip={
                  percentsInCaption
                    ? tooltipPercents
                    : tt('settings_jsx.default_voting_power_tip', {
                        value,
                      })
                }
              />
            ) : (
              <Handle>{value}</Handle>
            )}
          </HandleWrapper>
        </HandleSlot>
        {showCaptions && (
          <Captions>
            <Caption left>{leftCaption}%</Caption>
            <Caption center>{centralCaption}%</Caption>
            <Caption right>{rightCaption}%</Caption>
          </Captions>
        )}
      </Wrapper>
    );
  }

  removeListeners() {
    if (this.isListenerActive) {
      this.isListenerActive = false;
      window.removeEventListener('mousemove', this.onMove);
      window.removeEventListener('mouseup', this.onMovingEnd);
      window.removeEventListener('touchmove', this.onMove);
      window.removeEventListener('touchend', this.onMovingEnd);
      window.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  calculateValue(e) {
    let clientX = e.clientX;
    if (!clientX && e.changedTouches) {
      clientX = e.changedTouches[0].clientX;
    }

    const { min, max } = this.props;
    const box = this.rootRef.current.getBoundingClientRect();

    const unbound = Math.round(min + ((max - min) * (clientX - box.left)) / box.width);

    return Math.min(max, Math.max(min, unbound));
  }

  resetMoving() {
    this.removeListeners();
  }

  onClick = e => {
    this.setState({
      value: this.calculateValue(e),
    });
    e.preventDefault();
  };

  onMouseDown = e => {
    this.setState({
      value: this.calculateValue(e),
    });

    if (!this.isListenerActive) {
      this.isListenerActive = true;
      window.addEventListener('mousemove', this.onMove);
      window.addEventListener('mouseup', this.onMovingEnd);
      window.addEventListener('visibilitychange', this.onVisibilityChange);
    }
    e.preventDefault();
  };

  onTouchStart = e => {
    this.setState({
      value: this.calculateValue(e),
    });

    if (!this.isListenerActive) {
      this.isListenerActive = true;
      window.addEventListener('touchmove', this.onMove);
      window.addEventListener('touchend', this.onMovingEnd);
      window.addEventListener('visibilitychange', this.onVisibilityChange);
    }
    e.preventDefault();
  };

  onMove = e => {
    this.props.onChange(this.calculateValue(e));
    e.preventDefault();
  };

  onMovingEnd = e => {
    this.resetMoving();
    this.props.onChange(this.calculateValue(e));
    e.preventDefault();
  };

  onVisibilityChange = () => {
    if (document.hidden) {
      this.resetMoving();
    }
  };
}
