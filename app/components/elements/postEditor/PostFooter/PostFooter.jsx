import React, { PureComponent, createRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import TagInput from 'app/components/elements/postEditor/TagInput';
import TagsEditLine from 'app/components/elements/postEditor/TagsEditLine';
import PostOptions from 'app/components/elements/postEditor/PostOptions/PostOptions';
import Button from 'app/components/elements/common/Button';
import Hint from 'app/components/elements/common/Hint';
import Icon from 'golos-ui/Icon';
import PreviewButton from 'app/components/elements/postEditor/PreviewButton';
import { NSFW_TAG } from 'app/utils/tags';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    height: 80px;

    @media (max-width: 576px) {
        flex-direction: column;
        justify-content: center;
        height: auto;
        width: 100%;
        max-width: 100%;
    }

    ${is('isEdit')`
        margin-bottom: 50px;
    `};
`;

const Tags = styled.div`
    flex-grow: 1;
    height: 100%;
    display: flex;
    align-items: center;
`;

const ButtonsWrapper = styled.div`
    @media (max-width: 576px) {
        display: none;
    }
`;

const Buttons = styled.div`
    display: flex;
    flex-shrink: 0;
`;

const MobileButtons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const ConfirmButtonWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
    margin-left: 15px !important;

    &:last-child {
        margin-right: 0;
    }
`;

const DisabledHint = styled(Hint)`
    opacity: 0;
    transition: opacity 0.25s;

    ${is('isVisible')`
        opacity: 1;
    `};
`;

const SendButton = styled.button`
    color: #2879ff;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    user-select: none;
    cursor: pointer;

    &:disabled {
        color: #92aede;
    }
`;

const ClearButton = styled.button`
    color: #333;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    user-select: none;
    cursor: pointer;
`;

export default class PostFooter extends PureComponent {
    static propTypes = {
        editMode: PropTypes.bool,
        tags: PropTypes.array,
        postDisabled: PropTypes.bool,
        disabledHint: PropTypes.string,
        onPayoutTypeChange: PropTypes.func.isRequired,
        onTagsChange: PropTypes.func.isRequired,
        onPostClick: PropTypes.func.isRequired,
        onResetClick: PropTypes.func.isRequired,
        onCancelClick: PropTypes.func.isRequired,
    };

    state = { temporaryErrorText: null, singleLine: true, showHint: false };

    root = createRef();

    componentDidMount() {
        this._checkSingleLine();

        this._resizeInterval = setInterval(() => {
            this._checkSingleLine();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this._resizeInterval);
        clearTimeout(this._temporaryErrorTimeout);
    }

    render() {
        const {
            editMode,
            tags,
            postDisabled,
            disabledHint,
            onTagsChange,
            mobileButtonsWrapperRef,
            isPreview,
            isVisible,
            onPreviewChange,
        } = this.props;
        const { temporaryErrorText, singleLine, showHint } = this.state;

        return (
            <Wrapper innerRef={this.root} isEdit={editMode}>
                <Tags>
                    <TagInput tags={tags} onChange={onTagsChange} />
                    {singleLine ? (
                        <TagsEditLine
                            tags={tags}
                            inline
                            editMode={editMode}
                            className="PostFooter__inline-tags-line"
                            hidePopular={editMode}
                            onChange={this.props.onTagsChange}
                        />
                    ) : null}
                </Tags>
                <PostOptions
                    nsfw={this.props.tags.includes(NSFW_TAG)}
                    onNsfwClick={this._onNsfwClick}
                    payoutType={this.props.payoutType}
                    editMode={editMode}
                    onPayoutChange={this.props.onPayoutTypeChange}
                />
                {mobileButtonsWrapperRef &&
                    mobileButtonsWrapperRef.current &&
                    createPortal(
                        <MobileButtons>
                            <ClearButton
                                onClick={this.props.onCancelClick}
                                aria-label={editMode ? tt('g.cancel') : tt('g.clear')}
                            >
                                <Icon name="cross_thin" size={17} />
                            </ClearButton>
                            <PreviewButton
                                isPreview={isPreview}
                                isVisible={isVisible}
                                onPreviewChange={onPreviewChange}
                                isStatic
                            />
                            <SendButton
                                disabled={postDisabled}
                                onClick={this.props.onPostClick}
                                aria-label={editMode ? tt('post_editor.update') : tt('g.post')}
                            >
                                <Icon name="send" width={32} height={22} />
                            </SendButton>
                        </MobileButtons>,
                        mobileButtonsWrapperRef.current
                    )}
                <ButtonsWrapper>
                    <Buttons>
                        {editMode ? (
                            <Button onClick={this.props.onCancelClick}>{tt('g.cancel')}</Button>
                        ) : (
                            <Button onClick={this.props.onResetClick}>{tt('g.clear')}</Button>
                        )}
                        <ConfirmButtonWrapper>
                            {postDisabled && disabledHint ? (
                                <DisabledHint key="1" warning align="right" isVisible={showHint}>
                                    {disabledHint}
                                </DisabledHint>
                            ) : temporaryErrorText ? (
                                <DisabledHint key="2" error align="right">
                                    {temporaryErrorText}
                                </DisabledHint>
                            ) : null}
                            <Button
                                primary
                                disabled={postDisabled}
                                onClick={this.props.onPostClick}
                                onMouseOver={this.showHint}
                                onMouseOut={this.hideHint}
                            >
                                {editMode ? tt('post_editor.update') : tt('g.post')}
                            </Button>
                        </ConfirmButtonWrapper>
                    </Buttons>
                </ButtonsWrapper>
                {singleLine ? null : (
                    <TagsEditLine
                        className="PostFooter__tags-line"
                        editMode={editMode}
                        tags={tags}
                        hidePopular={editMode}
                        onChange={onTagsChange}
                    />
                )}
            </Wrapper>
        );
    }

    showHint = (isDisabled = this.props.postDisabled) => {
        const { showHint } = this.state;
        if (isDisabled && !showHint) {
            this.setState({ showHint: true });
        }
    };

    hideHint = (isDisabled = this.props.postDisabled) => {
        const { showHint } = this.state;
        if (isDisabled && showHint) {
            this.setState({ showHint: false });
        }
    };

    showPostError(errorText) {
        clearTimeout(this._temporaryErrorTimeout);

        this.setState({ temporaryErrorText: errorText });

        this._temporaryErrorTimeout = setTimeout(() => {
            this.setState({ temporaryErrorText: null });
        }, 5000);
    }

    _checkSingleLine() {
        const singleLine = this.root.current.clientWidth > 950;

        if (this.state.singleLine !== singleLine) {
            this.setState({ singleLine });
        }
    }

    _onNsfwClick = () => {
        const tags = this.props.tags;
        let newTags;

        if (tags.includes(NSFW_TAG)) {
            newTags = tags.filter(t => t !== NSFW_TAG);
        } else {
            newTags = tags.concat(NSFW_TAG);
        }

        this.props.onTagsChange(newTags);
    };
}
