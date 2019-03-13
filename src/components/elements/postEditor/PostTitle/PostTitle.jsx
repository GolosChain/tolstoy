import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import KEYS from 'utils/keyCodes';
import Hint from 'components/elements/common/Hint';
import { breakWordStyles } from 'helpers/styles';
import { safePaste } from 'helpers/browser';

const INPUT_HEIGHT = 38;

const Root = styled.div`
  position: relative;
  padding: 2px 0 12px;
  ${breakWordStyles};
`;

const Input = styled.div`
  display: block;
  width: 100%;
  min-height: ${INPUT_HEIGHT}px;
  padding: 0;
  margin: 0;
  line-height: ${INPUT_HEIGHT}px;
  outline: none;
  color: #343434;
  font-size: 2rem;
  font-weight: 500;
  overflow: hidden;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-top: 2px;
  line-height: ${INPUT_HEIGHT}px;
  color: #999;
  font-size: 2rem;
  font-weight: 300;
  pointer-events: none;
  user-select: none;
`;

export default class PostTitle extends PureComponent {
  static propTypes = {
    initialValue: PropTypes.string,
    placeholder: PropTypes.string,
    validate: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onTab: PropTypes.func.isRequired,
  };

  state = {
    showDotAlert: false,
    dotAlertAlreadyShown: false,
    showPlaceholder: !this.props.initialValue,
  };

  inputRef = createRef();

  componentWillReceiveProps(newProps) {
    const { dotAlertAlreadyShown, showDotAlert } = this.state;

    if (!dotAlertAlreadyShown && !showDotAlert && /[.,;:]$/.test(newProps.value)) {
      this.setState({
        showDotAlert: true,
        dotAlertAlreadyShown: true,
      });

      this._dotTimeout = setTimeout(() => {
        this.setState({
          showDotAlert: false,
        });
      }, 5000);
    }
  }

  componentDidMount() {
    if (this.props.initialValue && !this.inputRef.current.innerText) {
      this.inputRef.current.innerText = this.props.initialValue;
    }
  }

  componentWillUnmount() {
    clearTimeout(this._dotTimeout);
  }

  reset = () => {
    this.inputRef.current.innerText = '';
  };

  render() {
    const { placeholder } = this.props;
    const { showDotAlert } = this.state;
    let text = '';

    if (this.props.initialValue) {
      text = this.inputRef.current ? this.inputRef.current.innerText : this.props.initialValue;
    }

    let error = this.props.validate(text);
    let isDotWarning = false;

    if (!error && showDotAlert) {
      error = tt('post_editor.cant_ends_with_special_char');
      isDotWarning = true;
    }

    return (
      <Root>
        {text && text !== '\n' ? null : <Placeholder>{placeholder}</Placeholder>}
        <Input
          ref={this.inputRef}
          contentEditable
          tabIndex="0"
          onKeyDown={this.onKeyDown}
          onInput={this.onInput}
          onPaste={safePaste}
        />
        {error ? (
          <Hint
            error={!isDotWarning}
            warning={isDotWarning}
            align="left"
            width={isDotWarning ? 392 : null}
          >
            {error}
          </Hint>
        ) : null}
      </Root>
    );
  }

  onKeyDown = e => {
    if (e.which === KEYS.TAB || e.which === KEYS.ENTER) {
      e.preventDefault();
      this.props.onTab();
    }
  };

  onInput = () => {
    const text = this.inputRef.current.innerText;
    const showPlaceholder = !text;

    if (this.state.showPlaceholder !== showPlaceholder) {
      this.setState({ showPlaceholder });
    }

    this.props.onChange(text);
  };
}
