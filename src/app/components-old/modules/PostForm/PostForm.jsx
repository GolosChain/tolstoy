import React, { Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import Turndown from 'turndown';
import tt from 'counterpart';

import HtmlReady, { getTags } from 'src/app/shared/HtmlReady';
import DialogManager from 'src/app/components-old/elements/common/DialogManager';
import Icon from 'src/app/components-old/elements/Icon';
import MarkdownEditor from 'src/app/components-old/elements/postEditor/MarkdownEditor/MarkdownEditor';
import HtmlEditor from 'src/app/components-old/elements/postEditor/HtmlEditor/HtmlEditor';
import EditorSwitcher from 'src/app/components-old/elements/postEditor/EditorSwitcher/EditorSwitcher';
import PostFooter from 'src/app/components-old/elements/postEditor/PostFooter/PostFooter';
import PostTitle from 'src/app/components-old/elements/postEditor/PostTitle/PostTitle';
import PreviewButton from 'src/app/components-old/elements/postEditor/PreviewButton';
import MarkdownViewer, { getRemarkable } from 'src/app/components-old/cards/MarkdownViewer';
import { checkPostHtml } from 'src/app/utils/validator';
import { DEBT_TICKER } from 'src/app/constants/config';
import {
  processTagsFromData,
  processTagsToSend,
  validateTags,
  updateFavoriteTags,
} from 'src/app/utils/tags';
import { DRAFT_KEY, EDIT_KEY } from 'src/app/utils/postForm';
import { breakWordStyles } from 'src/app/helpers/styles';

const EDITORS_TYPES = {
  MARKDOWN: 1,
  MARKDOWN_OLD: 2,
  HTML: 3,
};

export const PAYOUT_TYPES = {
  PAY_0: 1,
  PAY_50: 2,
  PAY_100: 3,
};

const DEFAULT_CURATION_PERCENT = 5000; // 50%

export const PAYOUT_OPTIONS = [
  {
    id: PAYOUT_TYPES.PAY_100,
    title: 'post_editor.payout_option_100',
    hint: 'post_editor.payout_option_100_hint',
  },
  {
    id: PAYOUT_TYPES.PAY_50,
    title: 'post_editor.payout_option_50',
    hint: 'post_editor.payout_option_50_hint',
  },
  {
    id: PAYOUT_TYPES.PAY_0,
    title: 'post_editor.payout_option_0',
    hint: 'post_editor.payout_option_0_hint',
  },
];

const Preview = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const PreviewHeader = styled.h1`
  font-weight: 700;
  font-size: 200%;
  ${breakWordStyles};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;

  @media (min-width: 861px) {
    min-height: calc(100vh - 60px);

    ${is('isEdit')`
            min-height: 100%;
        `};
  }
`;

const WorkArea = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  min-height: 400px;
  height: calc(100% - 80px);
  padding-top: 10px;
  overflow-y: auto;

  ${is('isEdit')`
        padding: 10px 70px 0;
    `};

  @media (max-width: 576px) {
    ${is('isEdit')`
            padding: 10px 20px 0;
        `};
  }
`;

const Content = styled.div`
  max-width: 700px;
  padding: 0 8px;
  margin: 0 auto;

  @media (max-width: 860px) {
    overflow-x: hidden;
    max-width: 100%;
  }
`;

const Footer = styled.div`
  width: 100%;
  flex-shrink: 0;
  z-index: 1;
  user-select: none;
  background: #fff;
  box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.07);
  margin-top: 10px;

  ${is('isEdit')`
        box-shadow: none;
    `};
`;

const FooterContent = styled.div`
  width: 100%;
  max-width: 75rem;
  padding: 0 8px;
  margin: 0 auto;

  @media (max-width: 860px) {
    max-width: 100%;
    padding: 0;
    overflow: hidden;
  }
`;

const SpinnerContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
  animation: fade-in 1s forwards;
  animation-delay: 0.3s;
`;

const SpinnerWrapper = styled.div`
  padding: 40px 60px;
  border-radius: 18px;
  color: #999;
  background: rgba(0, 0, 0, 0.1);
`;

const EditorSwitcherWrapper = styled.div`
  @media (max-width: 860px) {
    display: none;
  }
`;

export default class PostForm extends React.Component {
  static propTypes = {
    editMode: PropTypes.bool,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func,

    // for editMode = true
    permLink: PropTypes.string,
    parentPermLink: PropTypes.string,
    category: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    payoutType: PropTypes.number,
    jsonMetadata: PropTypes.object,
  };

  previewButton = createRef();
  workAreaRef = createRef();
  editorWrapper = createRef();
  postTitle = createRef();

  constructor(props) {
    super(props);

    const { editMode } = this.props;

    this.state = {
      isPreview: false,
      editorId: EDITORS_TYPES.MARKDOWN,
      title: '',
      text: '',
      emptyBody: true,
      rteState: null,
      tags: [],
      payoutType: PAYOUT_TYPES.PAY_50,
      curationPercent: DEFAULT_CURATION_PERCENT,
      isPosting: false,
      uploadingCount: 0,
      isPreviewButtonVisible: true,
    };

    this._saveDraftLazy = throttle(this._saveDraft, 500, { leading: true });
    this._checkBodyLazy = throttle(this._checkBody, 300, {
      leading: false,
    });
    this._postSafe = this._safeWrapper(this._post);

    let isLoaded = false;

    try {
      isLoaded = this._tryLoadDraft();
    } catch (err) {
      console.warn('[Golos.io] Draft recovering failed:', err);
    }

    if (!isLoaded && editMode) {
      this._fillFromMetadata();
    }
  }

  componentDidMount() {
    const { editMode } = this.props;

    window.addEventListener('scroll', this._checkPreviewButtonPosition);

    if (!editMode) {
      this.props.fetchChainProperties();
    }
  }

  _tryLoadDraft() {
    const { editMode } = this.props;

    let json;

    if (editMode) {
      json = sessionStorage.getItem(EDIT_KEY);
    } else {
      json = localStorage.getItem(DRAFT_KEY);
    }

    if (json) {
      const draft = JSON.parse(json);

      if (editMode && draft.permLink !== this.props.permLink) {
        return;
      }

      const state = this.state;

      state.editorId = draft.editorId;
      state.title = draft.title;
      state.text = draft.text;
      state.emptyBody = draft.text.trim().length === 0;
      state.tags = draft.tags;
      state.payoutType = draft.payoutType || PAYOUT_TYPES.PAY_50;
      state.curationPercent = draft.curationPercent || DEFAULT_CURATION_PERCENT;

      if (state.editorId === EDITORS_TYPES.MARKDOWN_OLD) {
        state.editorId = EDITORS_TYPES.MARKDOWN;
      }

      if (state.editorId === EDITORS_TYPES.HTML) {
        state.text = null;
        state.rteState = HtmlEditor.getStateFromHtml(draft.text);
      }

      return true;
    }
  }

  _fillFromMetadata() {
    const { title, body, category, payoutType, curationPercent, jsonMetadata } = this.props;

    if (jsonMetadata.format === 'markdown') {
      this.state.editorId = EDITORS_TYPES.MARKDOWN;
    } else if (body.startsWith('<html')) {
      this.state.editorId = EDITORS_TYPES.HTML;
    }

    this.state.title = title;

    if (this.state.editorId === EDITORS_TYPES.HTML) {
      this.state.text = null;
      this.state.rteState = HtmlEditor.getStateFromHtml(body);
    } else {
      this.state.text = body;
    }

    this.state.emptyBody = false;

    this.state.payoutType = payoutType;
    this.state.curationPercent = curationPercent;

    const tagsFromData = [...(jsonMetadata.tags || [])];

    if (tagsFromData[0] !== category) {
      tagsFromData.unshift(category);
    }

    this.state.tags = processTagsFromData(tagsFromData);
  }

  componentWillUnmount() {
    this._unmount = true;
    window.removeEventListener('scroll', this._checkPreviewButtonPosition);
  }

  render() {
    const { editMode, mobileButtonsWrapperRef } = this.props;

    const {
      editorId,
      title,
      text,
      tags,
      payoutType,
      curationPercent,
      isPreview,
      uploadingCount,
      isPosting,
      isPreviewButtonVisible,
    } = this.state;

    const disallowPostCode = this._checkDisallowPost();

    return (
      <Wrapper isEdit={editMode}>
        <WorkArea ref={this.workAreaRef} isEdit={editMode}>
          <Content>
            <PreviewButton
              ref={this.previewButton}
              isPreview={isPreview}
              isVisible={isPreviewButtonVisible}
              isDesktop
              onPreviewChange={this._onPreviewChange}
            />
            <EditorSwitcherWrapper>
              <EditorSwitcher
                items={[
                  {
                    id: EDITORS_TYPES.MARKDOWN,
                    text: tt('post_editor.new_editor'),
                  },
                  { id: EDITORS_TYPES.HTML, text: tt('post_editor.html_editor') },
                ]}
                activeId={editorId}
                onChange={this._onEditorChange}
              />
            </EditorSwitcherWrapper>
            {isPreview ? (
              <Preview>
                <PreviewHeader>{title.trim() || tt('post_editor.title_placeholder')}</PreviewHeader>
                <MarkdownViewer text={text} large />
              </Preview>
            ) : (
              <Fragment>
                <PostTitle
                  ref={this.postTitle}
                  initialValue={title}
                  placeholder={tt('post_editor.title_placeholder')}
                  validate={this._validateTitle}
                  onTab={this._onTitleTab}
                  onChange={this._onTitleChange}
                />
                {this._renderEditorPanel()}
              </Fragment>
            )}
          </Content>
        </WorkArea>
        <Footer isEdit={editMode}>
          <FooterContent>
            <PostFooter
              ref="footer"
              editMode={editMode}
              tags={tags}
              onTagsChange={this._onTagsChange}
              payoutType={payoutType}
              onPayoutTypeChange={this._onPayoutTypeChange}
              curationPercent={curationPercent}
              onCurationPercentChange={this._onCurationPercentChange}
              postDisabled={Boolean(disallowPostCode) || isPosting}
              disabledHint={disallowPostCode ? tt(disallowPostCode) : null}
              onPostClick={this._postSafe}
              onResetClick={this._onResetClick}
              onCancelClick={this._onCancelClick}
              mobileButtonsWrapperRef={mobileButtonsWrapperRef}
              isPreview={isPreview}
              isVisible={isPreviewButtonVisible}
              onPreviewChange={this._onPreviewChange}
            />
          </FooterContent>
        </Footer>
        {uploadingCount > 0 || isPosting ? (
          <SpinnerContainer>
            <SpinnerWrapper>
              <Icon name="clock" size="4x" />
            </SpinnerWrapper>
          </SpinnerContainer>
        ) : null}
      </Wrapper>
    );
  }

  _renderEditorPanel() {
    const { editorId, text } = this.state;
    const { editMode } = this.props;

    if (editorId === EDITORS_TYPES.MARKDOWN) {
      return (
        <div ref={this.editorWrapper}>
          <MarkdownEditor
            ref="editor"
            initialValue={text}
            scrollContainer={this.refs.workArea}
            wrapperRef={this.editorWrapper}
            placeholder={tt('post_editor.text_placeholder')}
            editMode={editMode}
            uploadImage={this._onUploadImage}
            onChangeNotify={this._onTextChangeNotify}
          />
        </div>
      );
    } else if (editorId === EDITORS_TYPES.HTML) {
      return (
        <HtmlEditor ref="editor" value={this.state.rteState} onChange={this._onHtmlEditorChange} />
      );
    }
  }

  _onEditorChange = async toEditorId => {
    const { editorId } = this.state;
    let newText = null;
    let newRteState = null;

    if (editorId === EDITORS_TYPES.HTML) {
      if (this.refs.editor.isEmpty()) {
        newText = '';
        newRteState = null;
      } else {
        if (!(await DialogManager.dangerConfirm(tt('post_editor.convert_to_md_warning')))) {
          return;
        }

        const td = new Turndown({
          headingStyle: 'atx',
        });

        newText = td.turndown(this.refs.editor.getValue());

        newText = newText.replace(
          /~~~ embed:([A-Za-z0-9_]+) (youtube|vimeo|coub) ~~~/g,
          (a, code, hosting) => {
            if (hosting === 'youtube') {
              return `https://youtube.com/watch?v=${code}`;
            } else if (hosting === 'coub') {
              return `https://coub.com/view/${code}`;
            } else {
              return `https://vimeo.com/${code}`;
            }
          }
        );

        newRteState = null;
      }
    } else if (editorId === EDITORS_TYPES.MARKDOWN) {
      const body = this.refs.editor.getValue();

      if (body.trim()) {
        if (!(await DialogManager.dangerConfirm(tt('post_editor.convert_to_html_warning')))) {
          return;
        }
      }

      newText = null;
      newRteState = markdownToHtmlEditorState(body);
    }

    this.setState(
      {
        editorId: toEditorId,
        text: newText,
        rteState: newRteState,
        isPreview: false,
      },
      this._saveDraftLazy
    );
  };

  _onPreviewChange = enable => {
    if (enable) {
      this._saveDraft();

      this.setState({
        isPreview: true,
        text: this.refs.editor.getValue(),
      });
    } else {
      this.setState({
        isPreview: false,
      });
    }
  };

  _onTitleChange = title => {
    this.setState(
      {
        title,
      },
      this._saveDraftLazy
    );
  };

  _onTitleTab = () => {
    try {
      this.refs.editor.focus();
    } catch (err) {}
  };

  _onHtmlEditorChange = state => {
    this.setState(
      {
        rteState: state,
      },
      this._onTextChangeNotify
    );
  };

  _onTextChangeNotify = () => {
    this._saveDraftLazy();
    this._checkBodyLazy();
  };

  _onTagsChange = tags => {
    this.setState(
      {
        tags,
      },
      this._saveDraftLazy
    );
  };

  _onCurationPercentChange = percent => {
    this.setState({ curationPercent: percent }, this._saveDraftLazy);
  };

  _onPayoutTypeChange = payoutType => {
    this.setState({ payoutType }, this._saveDraftLazy);
  };

  _saveDraft = () => {
    const { editMode, permLink } = this.props;
    const { isPreview, editorId, title, text, tags, payoutType, curationPercent } = this.state;

    try {
      let body;

      if (isPreview) {
        body = text;
      } else {
        body = this.refs.editor.getValue();
      }

      const save = {
        permLink: editMode ? permLink : undefined,
        editorId,
        title,
        text: body,
        tags,
        payoutType,
        curationPercent,
      };

      const json = JSON.stringify(save);

      if (editMode) {
        sessionStorage.setItem(EDIT_KEY, json);
      } else {
        localStorage.setItem(DRAFT_KEY, json);
      }
    } catch (err) {
      console.warn('[Golos.io] Draft not saved:', err);
    }
  };

  _validateTitle = title => {
    const _title = title.trim();

    if (/\*[\w\s]*\*|#[\w\s]*#|_[\w\s]*_|~[\w\s]*~|]\s*\(|]\s*\[/.test(_title)) {
      return tt('submit_a_story.markdown_not_supported');
    }
  };

  _safeWrapper(callback) {
    return (...args) => {
      try {
        return callback(...args);
      } catch (err) {
        console.error(err);
        this.refs.footer.showPostError('Что-то пошло не так');
      }
    };
  }

  _post = () => {
    const { author, editMode, selfVote } = this.props;
    const { title, tags, payoutType, curationPercent, editorId } = this.state;
    let error;

    if (!title.trim()) {
      this.refs.footer.showPostError(tt('category_selector_jsx.title_is_required'));
      return;
    }

    if (this._validateTitle(title)) {
      this.refs.footer.showPostError(tt('category_selector_jsx.title_is_not_valid'));
      return;
    }

    if (!tags.length) {
      this.refs.footer.showPostError(tt('category_selector_jsx.must_set_category'));
      return;
    }

    if ((error = validateTags(tags, true))) {
      this.refs.footer.showPostError(error);
      return;
    }

    const processedTags = processTagsToSend(tags);

    const body = this.refs.editor.getValue();
    let html;

    if (!body || !body.trim()) {
      this.refs.footer.showPostError(tt('post_editor.empty_body_error'));
      return;
    }

    if (editorId === EDITORS_TYPES.MARKDOWN) {
      html = getRemarkable().render(body);
    } else if (editorId === EDITORS_TYPES.HTML) {
      html = body;
    }

    const rtags = getTags(html);

    if (editorId === EDITORS_TYPES.HTML) {
      rtags.htmltags.delete('html');
    }

    if ((error = checkPostHtml(rtags))) {
      this.refs.footer.showPostError(error.text);
      return;
    }

    const meta = {
      app: 'golos.io/0.1',
      format: editorId === EDITORS_TYPES.HTML ? 'html' : 'markdown',
      tags: processedTags,
    };

    if (rtags.usertags.size) {
      meta.users = rtags.usertags;
    }

    if (rtags.images.size) {
      meta.image = Array.from(rtags.images);
    }

    if (rtags.links.size) {
      meta.links = Array.from(rtags.links);
    }

    const data = {
      author,
      title,
      body,
      category: processedTags[0],
      parent_author: '',
      json_metadata: meta,
      __config: {
        autoVote: Boolean(selfVote),
      },
    };

    if (editMode) {
      const { permLink, parentPermLink, body } = this.props;

      data.permlink = permLink;
      data.parent_permlink = parentPermLink;
      data.__config.originalBody = body;
    } else {
      const { minCurationPercent, maxCurationPercent } = this.props;

      const boundPercent = Math.min(
        Math.max(minCurationPercent, curationPercent),
        maxCurationPercent
      );

      const commentOptions = {
        curator_rewards_percent: boundPercent,
      };

      if (payoutType === PAYOUT_TYPES.PAY_0) {
        commentOptions.max_accepted_payout = '0.000 ' + DEBT_TICKER;
      } else if (payoutType === PAYOUT_TYPES.PAY_100) {
        commentOptions.percent_steem_dollars = 0;
      }

      data.__config.comment_options = commentOptions;
    }

    this.setState({
      isPosting: true,
    });

    this.props.onPost(
      data,
      () => {
        try {
          if (editMode) {
            sessionStorage.removeItem(EDIT_KEY);
          } else {
            localStorage.removeItem(DRAFT_KEY);
          }
        } catch (err) {}

        if (!this._unmount) {
          this.setState({
            isPosting: false,
          });

          this.props.onSuccess();
        }

        if (!editMode) {
          updateFavoriteTags(tags);
        }
      },
      err => {
        if (!this._unmount) {
          this.setState({
            isPosting: false,
          });

          this.refs.footer.showPostError(err.toString().trim());
        }
      }
    );
  };

  _onResetClick = () => {
    let rteState = null;

    if (this.state.editorId === EDITORS_TYPES.MARKDOWN) {
      if (this.refs.editor) {
        this.refs.editor.setValue('');
      }
    } else {
      rteState = HtmlEditor.getStateFromHtml('');
    }

    this.postTitle.current.reset();

    this.setState({
      title: '',
      text: '',
      rteState,
      tags: [],
      isPreview: false,
    });

    localStorage.removeItem(DRAFT_KEY);
  };

  _onCancelClick = async () => {
    if (await DialogManager.confirm(tt('g.are_you_sure'))) {
      try {
        sessionStorage.removeItem(EDIT_KEY);
      } catch (err) {}

      this.props.onCancel();
    }
  };

  _onUploadImage = (file, progress) => {
    this.setState(
      {
        uploadingCount: this.state.uploadingCount + 1,
      },
      () => {
        this.props.uploadImage({
          file,
          progress: data => {
            if (!this._unmount) {
              if (data && (data.url || data.error)) {
                this.setState({
                  uploadingCount: this.state.uploadingCount - 1,
                });
              }

              progress(data);
            }
          },
        });
      }
    );
  };

  _checkBody() {
    const editor = this.refs.editor;

    if (editor) {
      const value = editor.getValue();

      this.setState({
        emptyBody: value.trim().length === 0,
      });
    }
  }

  _checkDisallowPost() {
    const { title, emptyBody, tags, uploadingCount } = this.state;

    if (uploadingCount > 0) {
      return 'post_editor.wait_uploading';
    }

    if (!title.trim()) {
      return 'post_editor.enter_title';
    }

    if (emptyBody) {
      return 'post_editor.enter_body';
    }

    if (!tags.length) {
      return 'category_selector_jsx.must_set_category';
    }
  }

  _checkPreviewButtonPosition = () => {
    const { isPreviewButtonVisible } = this.state;
    const workArea = this.workAreaRef.current;
    const { current } = this.previewButton;

    const containerYBottom = workArea ? workArea.getBoundingClientRect().bottom : null;
    const previewButtonYTop = current ? current.getPreviewButtonPosition() : null;

    if (containerYBottom && previewButtonYTop) {
      if (containerYBottom < previewButtonYTop && isPreviewButtonVisible) {
        this.setState({
          isPreviewButtonVisible: false,
        });
      }
      if (containerYBottom >= previewButtonYTop && !isPreviewButtonVisible) {
        this.setState({
          isPreviewButtonVisible: true,
        });
      }
    }
  };
}

function markdownToHtmlEditorState(markdown) {
  let html;

  if (markdown && markdown.trim() !== '') {
    html = getRemarkable().render(markdown);
    html = HtmlReady(html);
  }

  return HtmlEditor.getStateFromHtml(html);
}
