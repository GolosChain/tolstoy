import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import is from 'styled-is';
import cn from 'classnames';
import tt from 'counterpart';

import transaction from 'app/redux/Transaction';
import DialogManager from 'app/components/elements/common/DialogManager';
import Icon from 'app/components/elements/Icon';
import MarkdownEditor from 'app/components/elements/postEditor/MarkdownEditor/MarkdownEditor';
import CommentFooter from 'app/components/elements/postEditor/CommentFooter';
import PreviewButton from 'app/components/elements/postEditor/PreviewButton';
import MarkdownViewer, { getRemarkable } from 'app/components/cards/MarkdownViewer';
import { checkPostHtml } from 'app/utils/validator';
import { showNotification } from 'src/app/redux/actions/ui';
import { getTags } from 'shared/HtmlReady';
import './CommentForm.scss';

const DRAFT_KEY = 'golos.comment.draft';

const PreviewButtonWrapper = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;

    ${is('emptyBody')`
        display: none;
    `};
`;

class CommentForm extends React.Component {
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
            postError: null,
            uploadingCount: 0,
        };

        this._saveDraftLazy = throttle(this._saveDraft, 300, {
            leading: false,
        });
        this._checkBodyLazy = throttle(this._checkBody, 300, { leading: true });
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

    _tryLoadDraft() {
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

    _fillFromMetadata() {
        const { params } = this.props;
        this.state.text = params.body;
        this.state.emptyBody = false;
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            setTimeout(() => {
                this.refs.editor.focus();
            }, 100);
        }

        if (this.props.forwardRef) {
            this.props.forwardRef.current = this;
        }
    }

    componentWillUnmount() {
        this._unmount = true;

        if (this.props.forwardRef) {
            this.props.forwardRef.current = null;
        }
    }

    render() {
        const { editMode, hideFooter, autoFocus } = this.props;

        const { text, emptyBody, postError, isPreview, uploadingCount } = this.state;

        const allowPost = uploadingCount === 0 && !emptyBody;

        return (
            <div
                className={cn('CommentForm', {
                    CommentForm_edit: editMode,
                })}
            >
                <div className="CommentForm__work-area">
                    <PreviewButtonWrapper emptyBody={emptyBody}>
                        <PreviewButton
                            isStatic
                            isPreview={isPreview}
                            onPreviewChange={this._onPreviewChange}
                        />
                    </PreviewButtonWrapper>
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
                            ref="editor"
                            autoFocus={autoFocus}
                            commentMode
                            initialValue={text}
                            placeholder={tt('g.reply')}
                            uploadImage={this._onUploadImage}
                            onChangeNotify={this._onTextChangeNotify}
                        />
                    </div>
                </div>
                {hideFooter ? null : (
                    <div className="CommentForm__footer">
                        <div className="CommentForm__footer-content">
                            <CommentFooter
                                ref="footer"
                                editMode={editMode}
                                errorText={postError}
                                postDisabled={!allowPost}
                                onPostClick={this._postSafe}
                                onCancelClick={this._onCancelClick}
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
        );
    }

    post() {
        this._postSafe();
    }

    cancel() {
        this._onCancelClick();
    }

    _onTextChangeNotify = () => {
        if (this.props.onChange) {
            this.props.onChange(this.refs.editor.getValue());
        }
        this._saveDraftLazy();
        this._checkBodyLazy();
    };

    _saveDraft = () => {
        const { editMode, params } = this.props;

        const body = this.refs.editor.getValue();

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
        const { author, editMode, params, jsonMetadata } = this.props;
        let error;

        const body = this.refs.editor.getValue();
        let html;

        if (!body || !body.trim()) {
            this.refs.footer.showPostError(tt('post_editor.empty_body_error'));
            return;
        }

        html = getRemarkable().render(body);

        const rtags = getTags(html);

        if ((error = checkPostHtml(rtags))) {
            this.refs.footer.showPostError(error.text);
            return;
        }

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

        if (rtags.usertags.size) {
            meta.users = rtags.usertags;
        }

        if (rtags.images.size) {
            meta.image = rtags.images;
        }

        if (rtags.links.size) {
            meta.links = rtags.links;
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
                if (this.props.clearAfterAction) {
                    this.refs.editor.setValue('');
                }
                this.props.onSuccess();
            },
            err => {
                this.refs.footer.showPostError(err.toString().trim());
            }
        );

    };

    _onCancelClick = async () => {
        const body = this.refs.editor.getValue();

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
                this.refs.editor.setValue('');
            }
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
}

export default connect(
    state => ({
        author: state.user.getIn(['current', 'username']),
    }),
    dispatch => ({
        onPost(payload, onSuccess, onError) {
            dispatch(
                transaction.actions.broadcastOperation({
                    type: 'comment',
                    operation: payload,
                    hideErrors: true,
                    errorCallback: onError,
                    successCallback: onSuccess,
                })
            );
        },
        uploadImage({ file, progress }) {
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
    })
)(CommentForm);
