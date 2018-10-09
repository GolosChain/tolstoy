import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import is from 'styled-is';
import { api, utils } from 'golos-js';
import memoize from 'lodash/memoize';
import throttle from 'lodash/throttle';

import SimpleInput from 'golos-ui/SimpleInput';
import keyCodes from 'app/utils/keyCodes';
import { getScrollElement } from 'src/app/helpers/window';

const MIN_SYMBOLS = 2;
const MAX_VARIANTS = 5;

const Wrapper = styled.label`
    position: relative;
    display: inline-flex;

    ${is('block')`
        display: flex;
    `};
`;

const Sign = styled.div`
    flex-shrink: 0;
    width: 35px;
    border: 1px solid #e1e1e1;
    border-right: none;
    border-radius: 6px 0 0 6px;
    line-height: 30px;
    text-align: center;
    color: #333;
    background: #e1e1e1;
    transition: border-color 0.25s;
    order: 1;

    ${is('open')`
        border-radius: 6px 0 0 0;
    `};

    ${is('error')`
        border-color: #ff7d7d;
    `};

    &::after {
        content: '@';
    }
`;

const SimpleInputStyled = styled(SimpleInput)`
    border-radius: 0 6px 6px 0;
    order: 2;

    ${is('open')`
        border-radius: 0 6px 0 0;
    `};

    ${is('error')`
        border-color: #ff7d7d;
    `};

    &:focus + ${Sign} {
        border-color: #8a8a8a;
    }
`;

const Autocomplete = styled.ul`
    position: absolute;
    padding: 0 0 5px;
    margin: -1px 0 4px;
    border: 1px solid #aeaeae;
    border-radius: 0 0 8px 8px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
    user-select: none;
    z-index: 500;
    animation: from-up 0.12s;
`;

const Item = styled.li`
    padding: 5px 14px;
    list-style: none;
    white-space: nowrap;
    font-size: 14px;
    color: #7c7c7c;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: none;
    cursor: pointer;
    user-select: none;
    transition: color 0.1s, background-color 0.1s;

    &:hover {
        color: #333;
        background: #f0f0f0;
    }

    ${is('selected')`
        color: #505050 !important;
        background: #b3d2f0 !important;
    `};
`;

const Dots = styled.div`
    padding: 0 11px 2px;

    &::after {
        content: '...';
    }
`;

export default class AccountNameInput extends PureComponent {
    state = {
        focus: false,
        open: false,
        valid: false,
        index: null,
        list: null,
        popoverPos: null,
    };

    _loadIndex = 0;
    _showIndex = null;

    componentDidMount() {
        this._mount = document.getElementById('content');
    }

    componentWillUnmount() {
        if (this._listen) {
            window.removeEventListener('scroll', this.repositionLazy);
            window.removeEventListener('resize', this.repositionLazy);
        }

        if (this.unbindBoxScroll) {
            this.unbindBoxScroll();
        }
    }

    componentWillReceiveProps(props) {
        if (this.props.value !== props.value) {
            this.setState({
                valid: !utils.validateAccountName(props.value),
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { open } = this.state;

        if (this.wrapper && !prevState.open && open) {
            if (!this._listen) {
                this._listen = true;
                window.addEventListener('scroll', this.repositionLazy);
                window.addEventListener('resize', this.repositionLazy);
            }

            this.reposition();
        }
    }

    reposition = () => {
        const { open, popoverPos } = this.state;

        if (!open) {
            return;
        }

        const box = this.wrapper.getBoundingClientRect();

        const pos = {
            top: getScrollElement().scrollTop + box.top + box.height - 1,
            left: box.left,
            width: box.width,
        };

        if (
            !popoverPos ||
            popoverPos.top !== pos.top ||
            popoverPos.left !== pos.left ||
            popoverPos.width !== pos.width
        ) {
            this.setState({
                popoverPos: pos,
            });
        }
    };

    repositionLazy = throttle(this.reposition, 50);

    tryOpen() {
        const { focus, list } = this.state;

        const newState = {
            open: focus && list && list.length,
        };

        if (!newState.open) {
            newState.index = null;
            newState.popoverPos = null;
        }

        this.setState(newState);
    }

    load = throttle(
        async value => {
            if (value.length < MIN_SYMBOLS) {
                return;
            }

            const loadIndex = ++this._loadIndex;

            try {
                const names = await this.loadAccounts(value);

                if (!this._showIndex || this._showIndex < loadIndex) {
                    const { focus } = this.state;

                    this._showIndex = loadIndex;

                    const newState = {
                        open: focus,
                        list: names,
                        index: 0,
                    };

                    if (!newState.open) {
                        newState.popoverPos = null;
                    }

                    this.setState(newState);
                }
            } catch (err) {
                console.error(err);
            }
        },
        400,
        { leading: false }
    );

    onChange = e => {
        const value = e.target.value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9.-]+/g, '');

        if (value === this.props.value) {
            return;
        }

        this.props.onChange(value);

        if (value.length >= MIN_SYMBOLS) {
            this.load(value);
        } else {
            this.setState({
                open: false,
                index: null,
                popoverPos: null,
            });
        }
    };

    onFocus = e => {
        this.setState(
            {
                focus: true,
            },
            () => {
                this.load(this.props.value);
            }
        );

        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    };

    onBlur = e => {
        this.setState({
            focus: false,
            open: false,
            index: null,
            popoverPos: null,
        });

        if (this.props.onBlur) {
            this.props.onBlur(e);
        }
    };

    onKeyDown = e => {
        const { open, list, index } = this.state;

        if (open) {
            switch (e.which) {
                case keyCodes.UP:
                case keyCodes.DOWN:
                    let newIndex;

                    if (e.which === keyCodes.UP) {
                        if (index === null) {
                            newIndex = 0;
                        } else {
                            newIndex = Math.max(0, index - 1);
                        }
                    } else if (e.which === keyCodes.DOWN) {
                        if (index === null) {
                            newIndex = 0;
                        } else {
                            newIndex = Math.min(Math.min(MAX_VARIANTS, list.length) - 1, index + 1);
                        }
                    }

                    if (newIndex != null) {
                        this.setState({
                            index: newIndex,
                        });
                    }
                    break;

                case keyCodes.ENTER:
                    this.setState({
                        open: false,
                        index: null,
                        popoverPos: null,
                    });

                    this.props.onChange(list[index]);
                    break;

                case keyCodes.ESCAPE:
                    this.setState({
                        open: false,
                        index: null,
                        popoverPos: null,
                    });
                    break;
            }
        } else {
            this.tryOpen();
        }

        if (this.props.onKeyDown) {
            this.props.onKeyDown(e);
        }
    };

    onItemClick = accountName => {
        this.setState({
            open: false,
            index: null,
            popoverPos: null,
        });

        this.props.onChange(accountName);
    };

    onRef = el => {
        this.wrapper = el;

        if (el) {
            const scrollParent = el.closest('.DialogManager');

            if (scrollParent) {
                if (this.unbindBoxScroll) {
                    this.unbindBoxScroll();
                }

                scrollParent.addEventListener('scroll', this.repositionLazy);

                this.unbindBoxScroll = () => {
                    this.unbindBoxScroll = null;
                    scrollParent.removeEventListener('scroll', this.repositionLazy);
                };
            }
        }
    };

    loadAccounts = memoize(word => api.lookupAccountsAsync(word, MAX_VARIANTS + 1));

    renderAutocomplete() {
        const { list, index, popoverPos } = this.state;

        return (
            <Autocomplete style={popoverPos}>
                {list.slice(0, MAX_VARIANTS).map((accountName, i) => (
                    <Item
                        key={accountName}
                        selected={i === index}
                        onClick={() => this.onItemClick(accountName)}
                    >
                        {accountName}
                    </Item>
                ))}
                {list.length > MAX_VARIANTS ? <Dots /> : null}
            </Autocomplete>
        );
    }

    render() {
        const { block, value } = this.props;
        const { open, list, focus, valid, popoverPos } = this.state;

        let isError = value && !focus && !valid;

        if (!isError && list && !list.includes(value)) {
            isError = true;
        }

        return (
            <Wrapper block={block ? 1 : 0} innerRef={this.onRef}>
                <SimpleInputStyled
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    {...this.props}
                    open={open ? 1 : 0}
                    error={isError ? 1 : 0}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                />
                <Sign open={open ? 1 : 0} error={isError ? 1 : 0} />
                {open && popoverPos ? createPortal(this.renderAutocomplete(), this._mount) : null}
            </Wrapper>
        );
    }
}
