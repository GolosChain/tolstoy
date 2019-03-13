import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'src/app/components-old/elements/Icon';
import Hint from 'src/app/components-old/elements/common/Hint';
import { validateTag } from 'src/app/utils/tags';
import KEYS from 'src/app/utils/keyCodes';

const Wrapper = styled.div`
  position: relative;
  display: block;

  @media (max-width: 860px) {
    width: 100%;
  }
`;

const Input = styled.input`
  width: 240px;
  height: 40px;
  padding: 0 20px 1px 18px;
  border: none;
  border-radius: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.18);
  background-color: #fff;
  transition: none;

  &:focus {
    border: none;
  }

  &::placeholder {
    font-size: 15px;
  }

  @media (max-width: 860px) {
    width: 100%;
    padding: 0 20px 1px;
    border-bottom: 1px solid #e9e9e9;
    border-radius: 0;
    box-shadow: none;

    &:focus {
      border-bottom: 1px solid #e9e9e9;
      box-shadow: none;
    }
  }
`;

const StyledIcon = styled(Icon)`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 20px;
  height: 40px;
  line-height: 38px;
  cursor: pointer;
`;

const MobileError = styled.p`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 12px 16px 0;
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: normal;
  color: #333;

  ${is('isError')`
        color: #fc5d16;
    `};

  @media (min-width: 861px) {
    display: none;
  }
`;

const ErrorIcon = styled(Icon)`
  margin-right: 18px;
`;

export default class TagInput extends PureComponent {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  state = {
    value: '',
    inputError: null,
    temporaryHintText: null,
  };

  inputRef = createRef();

  componentWillUnmount() {
    if (this._hintTimeout) {
      clearTimeout(this._hintTimeout);
    }
  }

  render() {
    const { inputError, temporaryHintText, value } = this.state;

    return (
      <Wrapper>
        <Input
          value={value}
          type="text"
          ref={this.inputRef}
          maxLength="20"
          placeholder={tt('post_editor.tags_input_placeholder')}
          autoCapitalize="off"
          autoCorrect="off"
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onChange={this._onInputChange}
          onKeyDown={this._onInputKeyDown}
        />
        <StyledIcon name="editor/plus" data-tooltip={tt('g.add')} onClick={this._onPlusClick} />
        {inputError && !temporaryHintText && (
          <MobileError isError>
            <ErrorIcon name="editor/info" />
            {inputError}
          </MobileError>
        )}
        {temporaryHintText && !inputError && (
          <MobileError>
            <ErrorIcon name="editor/info" />
            {temporaryHintText}
          </MobileError>
        )}
        {this._renderErrorBlock()}
      </Wrapper>
    );
  }

  _renderErrorBlock() {
    const { inputError, temporaryHintText } = this.state;

    if (inputError) {
      return (
        <Hint error align="left">
          {inputError}
        </Hint>
      );
    }

    if (temporaryHintText) {
      return (
        <Hint info align="left">
          {temporaryHintText}
        </Hint>
      );
    }
  }

  _onFocus = () => {
    const { tags } = this.props;

    if (!tags.length && !this._hintTimeout) {
      this._hintTimeout = setTimeout(() => {
        this.setState({
          temporaryHintText: tt('category_selector_jsx.main_tag_hint'),
        });

        this._hintTimeout = setTimeout(() => {
          this.setState({
            temporaryHintText: null,
          });
        }, 4000);
      }, 200);
    }

    this.forceUpdate();
  };

  _onBlur = () => {
    this.forceUpdate();
  };

  _onInputChange = e => {
    const value = e.target.value ? e.target.value.toLowerCase() : '';

    if (/\s/.test(value) || Math.abs(this.state.value.length - value.length) >= 2) {
      const tags = value.split(/\s+/).filter(t => t);

      let inputError;

      for (let tag of tags) {
        inputError = this._checkTag(tag);

        if (inputError) {
          break;
        }
      }

      if (inputError) {
        this.setState({
          value,
          inputError,
        });
      } else {
        this._addTags(tags);
      }
    } else {
      this.setState({
        value,
        inputError: value ? this._checkTag(value) : null,
      });
    }
  };

  _addTags(addTags) {
    const { tags } = this.props;

    const newTags = [...tags];

    for (let newTag of addTags) {
      if (newTag && !tags.includes(newTag)) {
        newTags.push(newTag);
      }
    }

    this.setState({
      value: '',
      inputError: null,
    });

    this.props.onChange(newTags);
  }

  _addTag(tag) {
    this._addTags([tag]);
  }

  _onInputKeyDown = e => {
    if (e.which === KEYS.ENTER) {
      e.preventDefault();
      this._onPlusClick();
    }
  };

  _onPlusClick = () => {
    if (!this.state.inputError) {
      this._addTag(this.inputRef.current.value);
    }

    this.inputRef.current.focus();
  };

  _checkTag(tag) {
    if (/\s/.test(tag)) {
      return 'Тег не может содержать пробелы';
    }

    return validateTag(tag);
  }
}
