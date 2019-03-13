import React, { PureComponent, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import Icon from 'components/golos-ui/Icon';
import { listenLazy } from 'helpers/hoc';
import { FORCE_LINES_WIDTH } from 'components/common/CardsList/CardsList';
import LayoutSwitcherMenu from './LayoutSwitcherMenu';

const LAYOUTS = ['list', 'compact', 'grid'];

const IconStyled = styled(Icon)`
  display: block;
  width: 18px;
  height: 18px;
  transition: color 0.15s;
`;

const Handle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border: none;
  background: none;
  outline: none;
  color: ${({ mobile }) => (mobile ? '#393636' : '#b7b7b9')};
  cursor: pointer;
  -webkit-appearance: none;

  &:hover {
    color: #2879ff;
  }

  ${is('mobile')`
        ${IconStyled} {
            width: 14px;
            height: 14px;
        }
    `};
`;

@listenLazy('resize')
export default class LayoutSwitcher extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(['list', 'grid', 'compact']).isRequired,
    mobile: PropTypes.bool,
    changeProfileLayout: PropTypes.func.isRequired,
  };

  state = {
    isMobile: process.env.BROWSER ? window.innerWidth < FORCE_LINES_WIDTH : false,
    open: false,
  };

  handle = createRef();

  onHandleClick = () => {
    this.setState({
      open: true,
    });
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  onChange = layout => {
    this.props.changeProfileLayout(layout);
  };

  // called by @listenLazy('resize')
  onResize = () => {
    this.setState({
      isMobile: window.innerWidth < FORCE_LINES_WIDTH,
    });
  };

  render() {
    const { mobile, layout } = this.props;
    const { open, isMobile } = this.state;

    return (
      <Fragment>
        <Handle ref={this.handle} mobile={mobile} onClick={this.onHandleClick}>
          <IconStyled name={`layout_${layout}`} />
        </Handle>
        {open ? (
          <LayoutSwitcherMenu
            target={this.handle.current}
            layouts={isMobile ? LAYOUTS.filter(layout => layout !== 'grid') : LAYOUTS}
            activeLayout={layout}
            onChange={this.onChange}
            onClose={this.onClose}
          />
        ) : null}
      </Fragment>
    );
  }
}
