import React, { PureComponent, createRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import styled from 'styled-components';
import is from 'styled-is';

import TagInput from 'components/elements/postEditor/TagInput';
import TagsEditLine from 'components/elements/postEditor/TagsEditLine';
import PostOptions from 'components/elements/postEditor/PostOptions';
import Button from 'components/elements/common/Button';
import Hint from 'components/elements/common/Hint';
import Icon from 'components/golos-ui/Icon';
import InfoIcon from 'components/elements/Icon';
import PreviewButton from 'components/elements/postEditor/PreviewButton';
import { NSFW_TAG } from 'utils/tags';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 80px;

  @media (max-width: 860px) {
    flex-direction: column;
    justify-content: center;
    height: auto;
    width: 100%;
    max-width: 100%;
  }

  ${is('isEdit')`
    justify-content: center;
  `};
`;

const Tags = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  height: 100%;

  @media (max-width: 860px) {
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 100%;
  }

  ${is('isOtherLine')`
    flex-direction: column;
    flex-grow: 0;
  `};
`;

const ButtonsWrapper = styled.div`
  @media (max-width: 860px) {
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
  appearance: none;
  user-select: none;
  cursor: pointer;

  &:disabled {
    color: #92aede;
  }
`;

const ClearButton = styled.button`
  color: #333;
  appearance: none;
  user-select: none;
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

const ErrorIcon = styled(InfoIcon)`
  margin-right: 18px;
`;

export default class PostFooter extends PureComponent {
  static propTypes = {
    editMode: PropTypes.bool,
    tags: PropTypes.array,
    postDisabled: PropTypes.bool,
    disabledHint: PropTypes.string,
    onPayoutTypeChange: PropTypes.func.isRequired,
    onCurationPercentChange: PropTypes.func.isRequired,
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
      onResetClick,
      onCancelClick,
    } = this.props;
    const { temporaryErrorText, showHint } = this.state;

    return (
      <Fragment>
        <Wrapper ref={this.root} isEdit={editMode}>
          <Tags isOtherLine={editMode}>
            <TagInput tags={tags} onChange={onTagsChange} />
            {editMode ? null : (
              <TagsEditLine
                tags={tags}
                inline
                editMode={editMode}
                onChange={this.props.onTagsChange}
              />
            )}
          </Tags>
          {temporaryErrorText && !disabledHint && (
            <MobileError isError>
              <ErrorIcon name="editor/info" />
              {temporaryErrorText}
            </MobileError>
          )}
          {!temporaryErrorText && disabledHint && (
            <MobileError isError>
              <ErrorIcon name="editor/info" />
              {disabledHint}
            </MobileError>
          )}
          <PostOptions
            nsfw={this.props.tags.includes(NSFW_TAG)}
            payoutType={this.props.payoutType}
            curationPercent={this.props.curationPercent}
            editMode={editMode}
            onNsfwClick={this._onNsfwClick}
            onPayoutChange={this.props.onPayoutTypeChange}
            onCurationPercentChange={this.props.onCurationPercentChange}
          />
          {mobileButtonsWrapperRef &&
            mobileButtonsWrapperRef.current &&
            createPortal(
              <MobileButtons>
                <ClearButton
                  aria-label={editMode ? tt('g.cancel') : tt('g.clear')}
                  onClick={editMode ? onCancelClick : onResetClick}
                >
                  <Icon name="cross_thin" size={17} />
                </ClearButton>
                <PreviewButton
                  isPreview={isPreview}
                  isVisible={isVisible}
                  isStatic
                  isMobile
                  onPreviewChange={onPreviewChange}
                />
                <SendButton
                  disabled={postDisabled}
                  aria-label={editMode ? tt('post_editor.update') : tt('g.post')}
                  onClick={this.props.onPostClick}
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
              <ConfirmButtonWrapper onMouseOver={this.showHint} onMouseOut={this.hideHint}>
                {postDisabled && disabledHint ? (
                  <DisabledHint key="1" warning align="right" isVisible={showHint}>
                    {disabledHint}
                  </DisabledHint>
                ) : temporaryErrorText ? (
                  <DisabledHint key="2" error align="right" isVisible={showHint}>
                    {temporaryErrorText}
                  </DisabledHint>
                ) : null}
                <Button primary disabled={postDisabled} onClick={this.props.onPostClick}>
                  {editMode ? tt('post_editor.update') : tt('g.post')}
                </Button>
              </ConfirmButtonWrapper>
            </Buttons>
          </ButtonsWrapper>
        </Wrapper>
        {editMode ? (
          <TagsEditLine
            tags={tags}
            inline
            editMode={editMode}
            hidePopular={editMode}
            onChange={this.props.onTagsChange}
          />
        ) : null}
      </Fragment>
    );
  }

  showHint = (isDisabled = this.props.postDisabled) => {
    const { showHint } = this.state;
    if (isDisabled && !showHint) {
      this.setState({ showHint: true });
    }
  };

  hideHint = (isDisabled = this.props.postDisabled) => {
    const { showHint, temporaryErrorText } = this.state;
    if (isDisabled && showHint && !temporaryErrorText) {
      this.setState({ showHint: false });
    }
  };

  showPostError(errorText) {
    clearTimeout(this._temporaryErrorTimeout);

    this.setState({
      temporaryErrorText: errorText,
      showHint: true,
    });

    this._temporaryErrorTimeout = setTimeout(() => {
      this.setState({
        temporaryErrorText: null,
        showHint: false,
      });
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
