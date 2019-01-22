import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { isNil } from 'ramda';

import Icon from 'app/components/elements/Icon';
import Hint from 'app/components/elements/common/Hint';
import Switcher from 'golos-ui/Form/components/Switcher';
import Slider from 'golos-ui/Slider';
import RadioGroup from 'app/components/elements/common/RadioGroup';
import { PAYOUT_OPTIONS } from 'app/components/modules/PostForm/PostForm';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin: 0 30px;

    @media (max-width: 860px) {
        flex-direction: column;
        width: 100%;
        margin: 0;
    }
`;

const DesktopWrapper = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 860px) {
        display: none;
    }
`;

const ButtonContainer = styled.div`
    position: relative;
    flex-shrink: 0;
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

const CuratorText = styled.p`
    margin: 0 0 6px;
    font-size: 15px;
    white-space: nowrap;
    color: #393636;
`;

const CuratorValue = styled.b`
    display: inline-block;
    width: 38px;
    text-align: left;
    font-weight: 500;
`;

const MobileWrapper = styled.div`
    display: block;
    width: 100%;
    padding: 20px 16px;

    &:not(:last-child) {
        border-bottom: 1px solid #e9e9e9;
    }

    @media (min-width: 861px) {
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
        font-size: 15px;
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.33;
        letter-spacing: normal;
        color: #333333;
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

const SliderStyled = styled(Slider)`
    margin-top: 20px;
`;

export default class PostOptions extends PureComponent {
    static propTypes = {
        nsfw: PropTypes.bool.isRequired,
        payoutType: PropTypes.number.isRequired,
        curationPercent: PropTypes.number.isRequired,
        minCurationPercent: PropTypes.number,
        maxCurationPercent: PropTypes.number,
        editMode: PropTypes.bool,
        onNsfwClick: PropTypes.func.isRequired,
        onPayoutChange: PropTypes.func.isRequired,
        onCurationPercentChange: PropTypes.func.isRequired,
    };

    state = {
        showPayoutMenu: false,
        showCuratorMenu: false,
    };

    _curatorContainer = createRef();
    _payoutContainer = createRef();

    componentDidMount() {
        window.addEventListener('mousedown', this.onAwayClick);
    }

    componentWillUnmount() {
        this._unmount = true;
        window.removeEventListener('mousedown', this.onAwayClick);
    }

    render() {
        const {
            editMode,
            payoutType,
            nsfw,
            minCurationPercent,
            maxCurationPercent,
            onNsfwClick,
        } = this.props;
        const { showPayoutMenu, showCuratorMenu } = this.state;

        const showCurationPercent =
            editMode || (!isNil(minCurationPercent) && minCurationPercent !== maxCurationPercent);

        return (
            <Wrapper>
                <DesktopWrapper>
                    {showCurationPercent ? (
                        <ButtonContainer innerRef={this._curatorContainer}>
                            <IconWrapper isActive={showCuratorMenu} onClick={this._onCuratorClick}>
                                <Icon
                                    name="editor/k"
                                    size="1_5x"
                                    data-tooltip={tt('post_editor.payout_hint')}
                                />
                            </IconWrapper>
                            {showCuratorMenu ? this._renderCurationMenu() : null}
                        </ButtonContainer>
                    ) : null}
                    <ButtonContainer innerRef={this._payoutContainer}>
                        <IconWrapper isActive={showPayoutMenu} onClick={this._onPayoutClick}>
                            <Icon
                                name="editor/coin"
                                size="1_5x"
                                data-tooltip={tt('post_editor.payout_hint')}
                            />
                        </IconWrapper>
                        {showPayoutMenu ? this._renderPayoutMenu() : null}
                    </ButtonContainer>
                    <ButtonContainer>
                        <IconWrapper isWarning={nsfw} onClick={onNsfwClick}>
                            <Icon
                                name="editor/plus-18"
                                size="1_5x"
                                data-tooltip={tt('post_editor.nsfw_hint')}
                            />
                        </IconWrapper>
                    </ButtonContainer>
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
                        onChange={this.onPayoutModeChange}
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

    _renderCurationMenu() {
        const { curationPercent, minCurationPercent, maxCurationPercent, editMode } = this.props;

        let min;
        let max;
        let percent;
        let showCaptions;

        if (editMode) {
            min = 0;
            max = 100;
            percent = curationPercent / 100;
            showCaptions = false;
        } else {
            const actualPercent = Math.round(curationPercent / 100);

            min = Math.ceil(minCurationPercent / 100);
            max = Math.floor(maxCurationPercent / 100);
            percent = Math.max(Math.min(actualPercent, max), min);
            showCaptions = true;
        }

        return (
            <Hint align="center">
                <CuratorText>
                    {tt('post_editor.set_curator_percent')} <CuratorValue>{percent}%</CuratorValue>
                </CuratorText>
                <SliderStyled
                    value={percent}
                    min={min}
                    max={max}
                    disabled={editMode}
                    showCaptions={showCaptions}
                    onChange={this.onCurationPercentChange}
                />
            </Hint>
        );
    }

    _renderPayoutMenu() {
        const { editMode, payoutType } = this.props;

        return (
            <Hint align="center">
                <BubbleText>{tt('post_editor.set_payout_type')}:</BubbleText>
                <RadioGroup
                    disabled={editMode}
                    options={PAYOUT_OPTIONS.map(({ id, title, hint }) => ({
                        id,
                        title: tt(title),
                        hint: hint ? tt(hint) : null,
                    }))}
                    value={payoutType}
                    onChange={this.onPayoutModeChange}
                />
            </Hint>
        );
    }

    _onCuratorClick = () => {
        this.setState({
            showCuratorMenu: !this.state.showCuratorMenu,
            showPayoutMenu: false,
        });
    };

    _onPayoutClick = () => {
        this.setState({
            showPayoutMenu: !this.state.showPayoutMenu,
            showCuratorMenu: false,
        });
    };

    onCurationPercentChange = percent => {
        this.props.onCurationPercentChange(Math.round(percent * 100));
    };

    onPayoutModeChange = payoutMode => {
        this.props.onPayoutChange(payoutMode);
    };

    onAwayClick = e => {
        const { showPayoutMenu, showCuratorMenu } = this.state;

        if (showPayoutMenu || showCuratorMenu) {
            for (const dropdown of [this._payoutContainer, this._curatorContainer]) {
                if (dropdown.current && dropdown.current.contains(e.target)) {
                    return;
                }
            }

            setTimeout(() => {
                if (!this._unmount) {
                    this.setState({
                        showPayoutMenu: false,
                        showCuratorMenu: false,
                    });
                }
            }, 50);
        }
    };
}
