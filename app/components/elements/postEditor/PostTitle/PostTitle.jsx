import React, { PureComponent, createRef } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import KEYS from 'app/utils/keyCodes';
import Hint from 'app/components/elements/common/Hint';
import { breakWordStyles } from 'src/app/helpers/styles';

const MIN_INPUT_HEIGHT = 50;
const MAX_INPUT_HEIGHT = 114;

const Root = styled.div`
    position: relative;
    padding-top: 2px;
    ${breakWordStyles};
`;

const Input = styled.textarea`
    display: block;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none !important;
    background: none;
    line-height: 38px;
    outline: none !important;
    color: #343434;
    font-weight: 500;
    font-size: 2rem;
    box-shadow: none !important;
    resize: none;
    -webkit-appearance: none;
    -webkit-font-smoothing: antialiased;

    &::placeholder {
        color: #999;
    }
`;

export default class PostTitle extends PureComponent {
    state = {
        inputHeight: MIN_INPUT_HEIGHT,
        showDotAlert: false,
        dotAlertAlreadyShown: false,
    };

    input = createRef();

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
        setTimeout(() => {
            this.syncInputHeight();
        }, 0);
    }

    componentWillUnmount() {
        clearTimeout(this._dotTimeout);
    }

    render() {
        const { value, placeholder } = this.props;
        const { inputHeight, showDotAlert } = this.state;

        let error = this.props.validate(value);
        let isDotWarning = false;

        if (!error && showDotAlert) {
            error = tt('post_editor.cant_ends_with_special_char');
            isDotWarning = true;
        }

        return (
            <Root>
                <Input
                    innerRef={this.input}
                    placeholder={placeholder}
                    value={value}
                    style={{ height: inputHeight }}
                    onKeyDown={this._onKeyDown}
                    onChange={this._onChange}
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

    _onKeyDown = e => {
        if (e.which === KEYS.TAB || e.which === KEYS.ENTER) {
            e.preventDefault();
            this.props.onTab();
        }
    };

    _onChange = e => {
        this.props.onChange(e.target.value);

        this.syncInputHeight();
    };

    syncInputHeight() {
        const { inputHeight } = this.state;
        const input = this.input.current;

        const height = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, input.scrollHeight));

        if (inputHeight !== height) {
            this.setState({
                inputHeight: height,
            });
        }
    }
}
