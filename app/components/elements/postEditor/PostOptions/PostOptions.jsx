import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'app/components/elements/Icon';
import Hint from 'app/components/elements/common/Hint';
import Switcher from 'golos-ui/Form/components/Switcher';
import RadioGroup from 'app/components/elements/common/RadioGroup';
import { PAYOUT_OPTIONS } from 'app/components/modules/PostForm/PostForm';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 30px;

    @media (max-width: 576px) {
        flex-direction: column;
        width: 100%;
        margin: 0;
    }
`;

const DesktopWrapper = styled.div`
    position: relative;

    @media (max-width: 576px) {
        display: none;
    }
`;

const IconWrapper = styled.span`
    margin: 0 9px;
    padding: 4px;
    cursor: pointer;
    transition: color 0.1s;

    &:hover {
        color: #0078c4;
    }

    ${is('isWarning')`
        color: #ef3434;

        &:hover {
            color: #ef3434;
        }
    `};

    ${is('isActive')`
        color: #0078c4;
    `};
`;

const BubbleText = styled.p`
    margin: 0 0 6px;
    font-size: 14px;
    color: #757575;
`;

const MobileWrapper = styled.div`
    display: block;
    width: 100%;
    padding: 20px 16px;

    &:not(:last-child) {
        border-bottom: 1px solid #e9e9e9;
    }

    @media (min-width: 576px) {
        display: none;
    }
`;

const PayoutLabel = styled.h5`
    display: block;
    margin: 0;
    padding: 0 0 12px;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #959595;
`;

const StyledRadioGroup = styled(RadioGroup)`
    label {
        font-size: 15px !important;
        font-weight: 500 !important;
        font-style: normal !important;
        font-stretch: normal !important;
        line-height: 1.33 !important;
        letter-spacing: normal !important;
        color: #333333 !important;
    }
`;

const NsfwWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const NsfwIconWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const NsfwTip = styled.p`
    margin: 0;
    padding-left: 16px;
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: #333333;
`;

export default class PostOptions extends PureComponent {
    static propTypes = {
        nsfw: PropTypes.bool.isRequired,
        payoutType: PropTypes.number.isRequired,
        editMode: PropTypes.bool,
        onNsfwClick: PropTypes.func.isRequired,
        onPayoutChange: PropTypes.func.isRequired,
    };

    state = {
        showCoinMenu: false,
    };

    _onAwayClickListen = false;

    componentWillUnmount() {
        this._unmount = true;

        if (this._onAwayClickListen) {
            window.removeEventListener('mousedown', this._onAwayClick);
        }
    }

    render() {
        const { showCoinMenu } = this.state;
        const { editMode, payoutType, nsfw, onNsfwClick } = this.props;

        return (
            <Wrapper>
                <DesktopWrapper>
                    <IconWrapper isActive={showCoinMenu} onClick={this._onCoinClick}>
                        <Icon
                            name="editor/coin"
                            size="1_5x"
                            data-tooltip={tt('post_editor.payout_hint')}
                        />
                    </IconWrapper>
                    {showCoinMenu ? this._renderCoinMenu() : null}
                    <IconWrapper isWarning={nsfw} onClick={onNsfwClick}>
                        <Icon
                            name="editor/plus-18"
                            size="1_5x"
                            data-tooltip={tt('post_editor.nsfw_hint')}
                        />
                    </IconWrapper>
                </DesktopWrapper>
                <MobileWrapper>
                    <PayoutLabel>{tt('post_editor.set_payout_type')}</PayoutLabel>
                    <StyledRadioGroup
                        disabled={editMode}
                        options={PAYOUT_OPTIONS.map(({ id, title, hint }) => ({
                            id,
                            title: tt(title),
                            hint: hint ? tt(hint) : null,
                        }))}
                        value={payoutType}
                        onChange={this._onCoinModeChange}
                    />
                </MobileWrapper>
                <MobileWrapper>
                    <NsfwWrapper>
                        <NsfwIconWrapper>
                            <Icon name="editor/plus-18" size="1_5x" />

                            <NsfwTip>{tt('post_editor.nsfw_content')}</NsfwTip>
                        </NsfwIconWrapper>
                        <Switcher value={nsfw} onChange={onNsfwClick} />
                    </NsfwWrapper>
                </MobileWrapper>
            </Wrapper>
        );
    }

    _renderCoinMenu() {
        const { editMode, payoutType } = this.props;

        return (
            <Hint align="center" innerRef={this._onBubbleRef}>
                <BubbleText>{tt('post_editor.set_payout_type')}:</BubbleText>
                <RadioGroup
                    disabled={editMode}
                    options={PAYOUT_OPTIONS.map(({ id, title, hint }) => ({
                        id,
                        title: tt(title),
                        hint: hint ? tt(hint) : null,
                    }))}
                    value={payoutType}
                    onChange={this._onCoinModeChange}
                />
            </Hint>
        );
    }

    _onCoinClick = () => {
        this.setState(
            {
                showCoinMenu: !this.state.showCoinMenu,
            },
            () => {
                const { showCoinMenu } = this.state;

                if (showCoinMenu && !this._onAwayClickListen) {
                    window.addEventListener('mousedown', this._onAwayClick);
                    this._onAwayClickListen = true;
                }
            }
        );
    };

    _onCoinModeChange = coinMode => {
        this.props.onPayoutChange(coinMode);
    };

    _onAwayClick = e => {
        if (this._bubble && !this._bubble.contains(e.target)) {
            setTimeout(() => {
                if (!this._unmount) {
                    this.setState({
                        showCoinMenu: false,
                    });
                }
            }, 50);
        }
    };

    _onBubbleRef = el => {
        this._bubble = el;
    };
}
