import React, { Component, createRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import is from 'styled-is';
import cn from 'classnames';
import tt from 'counterpart';

import transaction from 'app/redux/Transaction';
import DialogManager from 'src/app/components-old/elements/common/DialogManager';
import Icon from 'src/app/components-old/elements/Icon';
import MarkdownEditor from 'src/app/components-old/elements/postEditor/MarkdownEditor/MarkdownEditor';
import CommentFooter from 'src/app/components-old/elements/postEditor/CommentFooter';
import PreviewButton from 'src/app/components-old/elements/postEditor/PreviewButton';
import MarkdownViewer, { getRemarkable } from 'src/app/components-old/cards/MarkdownViewer';
import { checkPostHtml } from 'src/app/utils/validator';
import { showNotification } from 'src/app/redux/actions/ui';
import { getTags } from 'src/app/shared/HtmlReady';
import './CommentForm.scss';
import { toggleCommentInputFocus } from 'src/app/redux/actions/ui';
import CommentAuthor from 'src/app/components/cards/CommentAuthor';
import { loginIfNeed } from 'src/app/redux/actions/login';

const DRAFT_KEY = 'golos.comment.draft';

const PreviewButtonWrapper = styled.div`
    z-index: 2;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(40px);

    ${is('emptyBody')`
        display: none;
    `};

    ${is('isStatic')`
        position: static;
        transform: translateX(0);
    `};
`;

const ReplyHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 12px 0 8px 0;
    margin-right: 18px;
`;

class CommentForm extends Component {
    static propTypes = {
        reply: PropTypes.bool,
        editMode: PropTypes.bool,
        params: PropTypes.object.isRequired,
        jsonMetadata: PropTypes.object,
        onSuccess: PropTypes.func,
        onCancel: PropTypes.func,
        onChange: PropTypes.func,
        autoFocus: PropTypes.bool,
        clearAfterAction: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        const { editMode, reply, params } = this.props;

        this.state = {
            text: reply ? `@${params.author} ` : '',
            emptyBody: true,
            uploadingCount: 0,
        };

        this.saveDraftLazy = throttle(this.saveDraft, 300, {
            leading: false,
        });
        this.checkBodyLazy = throttle(this.checkBody, 300, { leading: true });
        this.postSafe = this.safeWrapper(this.post);

        let isLoaded = false;

        try {
            isLoaded = this.tryLoadDraft();
        } catch (err) {
            console.warn('[Golos.io] Draft recovering failed:', err);
        }

        if (!isLoaded && editMode) {
            this.fillFromMetadata();
        }
    }

    footerRef = createRef();
    editorRef = createRef();

    componentDidMount() {
        if (location.hash === '#createComment') {
            this.setFocus();
            this.onInputFocused();
        } else if (this.props.autoFocus) {
            this.setFocus();
        }

        if (this.props.forwardRef) {
            this.props.forwardRef.current = this;
        }
    }

    componentWillUnmount() {
        this.unmount = true;

        if (this.props.forwardRef) {
            this.props.forwardRef.current = null;
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.commentInputFocused && nextProps.commentInputFocused) {
            this.setFocus();
        }
    }

    tryLoadDraft() {
        const { editMode, params } = this.props;

        const json = localStorage.getItem(DRAFT_KEY);

        if (json) {
            const draft = JSON.parse(json);

            if (draft.editMode !== editMode || draft.permLink !== params.permlink) {
                return;
            }

            const state = this.state;

            state.text = draft.text;
            state.emptyBody = draft.text.trim().length === 0;
            this.props.onChange(draft.text);
            return true;
        }
    }

    fillFromMetadata() {
        const { params } = this.props;
        this.state.text = params.body;
        this.state.emptyBody = false;
    }

    setFocus() {
        let iterationsCount = 0;
        const intervalId = setInterval(() => {
            this.editorRef.current.focus();

            if (++iterationsCount === 3) {
                clearInterval(intervalId);
            }
        }, 50);
    }

    render() {
        const { editMode, hideFooter, autoFocus, withHeader, replyAuthor } = this.props;

        const { text, emptyBody, isPreview, uploadingCount } = this.state;

        const allowPost = uploadingCount === 0 && !emptyBody;

        return (
            <Fragment>
                {withHeader && (
                    <ReplyHeader>
                        <CommentAuthor author={replyAuthor} />
                        {this.getPreviewButton()}
                    </ReplyHeader>
                )}
                <div className={cn('CommentForm', { CommentForm_edit: editMode })}>
                    <div className="CommentForm__work-area">
                        {withHeader ? null : this.getPreviewButton()}
                        {isPreview ? (
                            <div className="CommentForm__preview">
                                <MarkdownViewer text={text} />
                            </div>
                        ) : null}
                        <div
                            className={cn('CommentForm__content', {
                                CommentForm__content_hidden: isPreview,
                            })}
                        >
                            <MarkdownEditor
                                ref={this.editorRef}
                                autoFocus={autoFocus}
                                commentMode
                                initialValue={text}
                                placeholder={tt('g.reply')}
                                uploadImage={this.onUploadImage}
                                onChangeNotify={this.onTextChangeNotify}
                                onInputBlured={this.onInputBlured}
                            />
                        </div>
                    </div>
                    {hideFooter ? null : (
                        <div className="CommentForm__footer">
                            <div className="CommentForm__footer-content">
                                <CommentFooter
                                    ref={this.footerRef}
                                    editMode={editMode}
                                    postDisabled={!allowPost}
                                    onPostClick={this.postSafe}
                                    onCancelClick={this.onCancelClick}
                                />
                            </div>
                        </div>
                    )}
                    {uploadingCount > 0 ? (
                        <div className="CommentForm__spinner">
                            <Icon name="clock" size="4x" className="CommentForm__spinner-inner" />
                        </div>
                    ) : null}
                </div>
            </Fragment>
        );
    }

    getPreviewButton = () => {
        const { commentTitleRef, withHeader } = this.props;
        const { emptyBody, isPreview } = this.state;
        const previewButton = (
            <PreviewButton isStatic isPreview={isPreview} onPreviewChange={this._onPreviewChange} />
        );
        if (commentTitleRef) {
            return createPortal(
                <PreviewButtonWrapper emptyBody={emptyBody} isStatic>
                    {previewButton}
                </PreviewButtonWrapper>,
                commentTitleRef
            );
        }

        if (withHeader) {
            return (
                <PreviewButtonWrapper emptyBody={emptyBody} isStatic>
                    {previewButton}
                </PreviewButtonWrapper>
            );
        }

        return <PreviewButtonWrapper emptyBody={emptyBody}>{previewButton}</PreviewButtonWrapper>;
    };

    onInputBlured = () => {
        this.props.toggleCommentInputFocus(false);
    };

    onInputFocused = () => {
        this.props.toggleCommentInputFocus(true);
    };

    post() {
        this.postSafe();
    }

    cancel() {
        this.onCancelClick();
    }

    onTextChangeNotify = () => {
        if (this.props.onChange) {
            this.props.onChange(this.editorRef.current.getValue());
        }
        this.saveDraftLazy();
        this.checkBodyLazy();
    };

    saveDraft = () => {
        const { editMode, params } = this.props;

        const body = this.editorRef.current.getValue();

        this.setState({
            text: body,
        });

        try {
            const save = {
                editMode,
                permLink: params.permlink,
                text: body,
            };

            const json = JSON.stringify(save);

            localStorage.setItem(DRAFT_KEY, json);
        } catch (err) {
            console.warn('[Golos.io] Draft not saved:', err);
        }
    };

    safeWrapper(callback) {
        return (...args) => {
            try {
                return callback(...args);
            } catch (err) {
                console.error(err);
                this.footerRef.current.showPostError('Что-то пошло не так');
            }
        };
    }

    post = () => {
        let error;

        const body = this.editorRef.current.getValue();
        let html;

        if (!body || !body.trim()) {
            this.footerRef.current.showPostError(tt('post_editor.empty_body_error'));
            return;
        }

        html = getRemarkable().render(body);

        const rTags = getTags(html);

        if ((error = checkPostHtml(rTags))) {
            this.footerRef.current.showPostError(error.text);
            return;
        }

        this.props.loginIfNeed(logged => {
            if (!logged) {
                return;
            }

            this.publish({ rTags, body });
        });
    };

    publish({ rTags, body }) {
        const { author, editMode, params, jsonMetadata } = this.props;

        const meta = {
            app: 'golos.io/0.1',
            format: 'markdown',
            tags: [],
        };

        if (jsonMetadata && jsonMetadata.tags) {
            meta.tags = jsonMetadata.tags;
        } else {
            try {
                meta.tags = JSON.parse(params.json_metadata).tags || [];
            } catch (err) {}
        }

        if (params && params.category && meta.tags[0] !== params.category) {
            meta.tags.unshift(params.category);
        }

        if (rTags.usertags.size) {
            meta.users = rTags.usertags;
        }

        if (rTags.images.size) {
            meta.image = Array.from(rTags.images);
        }

        if (rTags.links.size) {
            meta.links = Array.from(rTags.links);
        }

        const data = {
            author,
            body,
            category: meta.tags[0],
            json_metadata: meta,
            __config: {
                autoVote: false,
                originalBody: null,
            },
        };

        if (editMode) {
            data.permlink = params.permlink;
            data.parent_author = params.parent_author;
            data.parent_permlink = params.parent_permlink;
            data.__config.originalBody = params.body;
        } else {
            data.parent_author = params.author;
            data.parent_permlink = params.permlink;
            data.__config.comment_options = {};
        }

        this.props.onPost(
            data,
            () => {
                try {
                    localStorage.removeItem(DRAFT_KEY);
                } catch (err) {}

                if (!this.unmount) {
                    if (this.props.clearAfterAction) {
                        this.editorRef.current.setValue('');
                    }

                    this.props.onSuccess();
                }
            },
            err => {
                if (!this.unmount && err !== 'Canceled') {
                    this.footerRef.current.showPostError(err.toString().trim());
                }
            }
        );
    }

    onCancelClick = async () => {
        const body = this.editorRef.current.getValue();

        if (
            !body ||
            !body.trim() ||
            (await DialogManager.confirm(tt('comment_editor.cancel_comment')))
        ) {
            try {
                localStorage.removeItem(DRAFT_KEY);
            } catch (err) {}

            this.props.onCancel();
            if (this.props.clearAfterAction) {
                this.editorRef.current.setValue('');
            }
        }
    };

    onUploadImage = (file, progress) => {
        this.setState(
            {
                uploadingCount: this.state.uploadingCount + 1,
            },
            () => {
                this.props.uploadImage({
                    file,
                    progress: data => {
                        if (!this.unmount) {
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

    checkBody() {
        const editor = this.editorRef.current;

        if (editor) {
            const value = editor.getValue();

            this.setState({
                emptyBody: value.trim().length === 0,
            });
        }
    }

    _onPreviewChange = enable => {
        if (enable) {
            this.saveDraft();

            this.setState({
                isPreview: true,
                text: this.editorRef.current.getValue(),
            });
        } else {
            this.setState({
                isPreview: false,
            });
        }
    };
}

export default connect(
    state => ({
        author: state.user.getIn(['current', 'username']),
        commentInputFocused: state.ui.common.get('commentInputFocused'),
    }),
    {
        loginIfNeed,
        toggleCommentInputFocus,
        onPost: (operation, onSuccess, onError) =>
            transaction.actions.broadcastOperation({
                type: 'comment',
                operation,
                hideErrors: true,
                errorCallback: onError,
                successCallback: onSuccess,
            }),
        uploadImage: ({ file, progress }) => dispatch => {
            dispatch({
                type: 'user/UPLOAD_IMAGE',
                payload: {
                    file,
                    progress: data => {
                        if (data && data.error) {
                            dispatch(showNotification(data.error));
                        }

                        progress(data);
                    },
                },
            });
        },
    }
)(CommentForm);
