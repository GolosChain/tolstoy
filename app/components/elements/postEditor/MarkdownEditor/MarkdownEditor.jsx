import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Dropzone from 'react-dropzone';
import tt from 'counterpart';
import cn from 'classnames';
import MarkdownEditorToolbar from 'app/components/elements/postEditor/MarkdownEditorToolbar';
import DialogManager from 'app/components/elements/common/DialogManager';
import './MarkdownEditor.scss';

const DELAYED_TIMEOUT = 1000;
const LINE_HEIGHT = 28;
let SimpleMDE;

if (process.env.BROWSER) {
    SimpleMDE = require('codemirror-md');
}

let lastWidgetId = 0;

export default class MarkdownEditor extends PureComponent {
    static propTypes = {
        initialValue: PropTypes.string,
        placeholder: PropTypes.string,
        autoFocus: PropTypes.bool,
        scrollContainer: PropTypes.any,
        commentMode: PropTypes.bool,
        onChangeNotify: PropTypes.func.isRequired,
        uploadImage: PropTypes.func.isRequired,
        onInputBlured: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.processTextLazy = throttle(this.processText, 100, {
            leading: false,
        });
        this.onCursorActivityLazy = debounce(this.onCursorActivity, 50);
    }

    componentDidMount() {
        // Don't init on server
        if (!process.env.BROWSER) {
            return;
        }

        if (window.INIT_TIMESSTAMP) {
            const timeDelta = DELAYED_TIMEOUT - (Date.now() - window.INIT_TIMESSTAMP);

            if (timeDelta > 0) {
                this._delayedTimeout = setTimeout(() => this.init(), timeDelta);
                return;
            }
        }

        this.init();
    }

    init() {
        const props = this.props;

        this.simplemde = new SimpleMDE({
            status: false,
            autofocus: props.autoFocus,
            placeholder: props.placeholder,
            initialValue: props.initialValue || '',
            element: this.refs.textarea,
            promptURLs: true,
            dragDrop: true,
            toolbar: false,
            toolbarTips: false,
            autoDownloadFontAwesome: false,
            spellCheck: true,
            blockStyles: {
                italic: '_',
            },
        });

        this.lineWidgets = [];

        this.cm = this.simplemde.codemirror;
        this.cm.on('change', this.onChange);
        this.cm.on('paste', this.onPaste);
        this.cm.on('blur', this.onBlur);

        if (props.scrollContainer) {
            this.cm.on('cursorActivity', this.onCursorActivityLazy);
        }

        if (this.props.autoFocus) {
            this.cm.setCursor({ line: 999, ch: 999 });
        }

        this.forceUpdate();

        // DEV: For experiments
        if (process.env.NODE_ENV !== 'production') {
            window.SM = SimpleMDE;
            window.sm = this.simplemde;
            window.cm = this.cm;
        }

        this._previewTimeout = setTimeout(() => {
            this.processText();
        }, 500);
    }

    componentWillUnmount() {
        clearTimeout(this._previewTimeout);
        clearTimeout(this._delayedTimeout);

        this.processTextLazy.cancel();
        this.onCursorActivityLazy.cancel();

        this.cm.off('change', this.onChange);
        this.cm.off('paste', this.onPaste);
        this.cm.off('blur', this.onBlur);
        this.cm.off('cursorActivity', this.onCursorActivityLazy);
        this.cm = null;
        this.simplemde = null;
    }

    render() {
        const { uploadImage, commentMode } = this.props;
        return (
            <div
                className={cn('MarkdownEditor', {
                    MarkdownEditor_comment: commentMode,
                })}
            >
                <Dropzone
                    className="MarkdownEditor__dropzone"
                    disableClick
                    multiple={false}
                    accept="image/*"
                    onDrop={this.onDrop}
                >
                    {this.simplemde ? (
                        <MarkdownEditorToolbar
                            commentMode={commentMode}
                            editor={this.simplemde}
                            uploadImage={uploadImage}
                            SM={SimpleMDE}
                        />
                    ) : null}
                    <textarea ref="textarea" className="MarkdownEditor__textarea" />
                </Dropzone>
            </div>
        );
    }

    focus() {
        this.cm.focus();
    }

    isFocused() {
        return this.cm.hasFocus();
    }

    getValue() {
        return this.simplemde.value();
    }

    setValue(value) {
        this.simplemde.value(value);
    }

    onBlur = () => {
        this.props.onInputBlured();
    };

    onChange = () => {
        this.props.onChangeNotify();
        this.processTextLazy();
    };

    onDrop = (acceptedFiles, rejectedFiles, e) => {
        const file = acceptedFiles[0];

        if (!file) {
            if (rejectedFiles.length) {
                DialogManager.alert(tt('reply_editor.please_insert_only_image_files'));
            }
            return;
        }

        const cursorPosition = this.cm.coordsChar({
            left: e.pageX,
            top: e.pageY,
        });

        this.props.uploadImage(file, progress => {
            if (progress.url) {
                const imageUrl = `![${file.name}](${progress.url})`;

                this.cm.replaceRange(imageUrl, cursorPosition);
            }
        });
    };

    processText = () => {
        this.cutIframes();
        this.processImagesPreview();
    };

    processImagesPreview() {
        const cm = this.cm;
        const alreadyWidgets = new Set();

        for (let widget of this.lineWidgets) {
            alreadyWidgets.add(widget);
        }

        for (let line = 0, last = cm.lineCount(); line < last; line++) {
            const lineContent = cm.getLine(line);

            let match;

            match = lineContent.match(/!\[[^\]]*\]\(([^)]+)\)/);

            if (!match) {
                match = lineContent.match(
                    /(?:^|\s)((?:https?:)?\/\/[^\s]+\.[^\s]+\.(?:jpe?g|png|gif))(?:\s|$)/
                );
            }

            if (match) {
                let url = match[1];

                if (!url.startsWith('http')) {
                    url = 'http:' + url;
                }

                if (this.addLineWidget(alreadyWidgets, line, url)) {
                    continue;
                }
            }

            match =
                lineContent.match(
                    /(?:^|\s)(?:https?:)?\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})(?:\s|&|$)/
                ) ||
                lineContent.match(
                    /(?:^|\s)(?:https?:)?\/\/youtu\.be\/([A-Za-z0-9_-]{11})(?:\s|&|$)/
                );

            if (match) {
                this.addLineWidget(
                    alreadyWidgets,
                    line,
                    `https://img.youtube.com/vi/${match[1]}/0.jpg`
                );
            }
        }

        this.lineWidgets = this.lineWidgets.filter(widget => !alreadyWidgets.has(widget));

        for (let widget of alreadyWidgets) {
            widget.clear();
        }
    }

    cutIframes() {
        const text = this.simplemde.value();

        let updated = false;

        const updatedText = text.replace(/<iframe\s+([^>]*)>[\s\S]*<\/iframe>/g, (a, attrsStr) => {
            const match = attrsStr.match(/src="([^"]+)"/);

            if (match) {
                let match2 = match[1].match(
                    /^https:\/\/www\.youtube\.com\/embed\/([A-Za-z0-9_-]+)/
                );

                if (match2) {
                    updated = true;
                    return `https://youtube.com/watch?v=${match2[1]}`;
                }

                match2 = match[1].match(
                    /^(?:https?:)?\/\/rutube\.ru\/play\/embed\/([A-Za-z0-9_-]+)/
                );

                if (match2) {
                    updated = true;
                    return `https://rutube.ru/video/${match2[1]}/`;
                }

                match2 = match[1].match(/^(?:https?:)?\/\/ok\.ru\/videoembed\/([A-Za-z0-9_-]+)/);

                if (match2) {
                    updated = true;
                    return `https://ok.ru/video/${match2[1]}`;
                }
            }
        });

        if (updated) {
            for (let w of this.lineWidgets) {
                w.clear();
            }

            this.lineWidgets = [];

            const cursor = this.cm.getCursor();
            this.simplemde.value(updatedText);

            setTimeout(() => {
                this.cm.setCursor(cursor);
            }, 0);
        }
    }

    addLineWidget(alreadyWidgets, line, url) {
        for (let widget of this.lineWidgets) {
            if (widget.line.lineNo() === line) {
                if (widget.url === url) {
                    alreadyWidgets.delete(widget);
                    return;
                }
            }
        }

        const img = new Image();
        img.classList.add('MarkdownEditor__preview');

        img.addEventListener('load', () => {
            const widget = this.cm.addLineWidget(line, img, {
                handleMouseEvents: true,
            });
            widget.id = ++lastWidgetId;
            widget.url = url;
            this.lineWidgets.push(widget);
        });

        img.addEventListener('error', () => {
            const div = document.createElement('div');
            div.classList.add('MarkdownEditor__preview-error');
            div.innerText = tt('post_editor.image_preview_error');
            const widget = this.cm.addLineWidget(line, div, {
                handleMouseEvents: true,
            });
            widget.id = ++lastWidgetId;
            widget.url = url;
            this.lineWidgets.push(widget);
        });

        img.src = $STM_Config.img_proxy_prefix + '0x0/' + url;
    }

    onPaste = (cm, e) => {
        try {
            if (e.clipboardData) {
                let fileName = null;

                for (let item of e.clipboardData.items) {
                    if (item.kind === 'string' && item.type === 'text/plain') {
                        try {
                            fileName = item.getAsString(a => (fileName = a));
                        } catch (err) {}
                    }

                    if (item.kind === 'file' && item.type.startsWith('image')) {
                        e.preventDefault();

                        const file = item.getAsFile();

                        this.props.uploadImage(file, progress => {
                            if (progress.url) {
                                const imageUrl = `![${fileName || file.name}](${progress.url})`;

                                this.cm.replaceSelection(imageUrl);
                            }
                        });
                    }
                }
            }
        } catch (err) {
            console.warn('Error analyzing clipboard event', err);
        }
    };

    // _tryToFixCursorPosition() {
    //     // Hack: Need some action for fix cursor position
    //     if (this.props.initialValue) {
    //         this.cm.execCommand('selectAll');
    //         this.cm.execCommand('undoSelection');
    //     } else {
    //         this.cm.execCommand('goLineEnd');
    //         this.cm.replaceSelection(' ');
    //         this.cm.execCommand('delCharBefore');
    //     }
    // }

    onCursorActivity = () => {
        const { scrollContainer } = this.props;

        if (scrollContainer) {
            const cursorPos = this.cm.cursorCoords();

            if (
                cursorPos.top + LINE_HEIGHT + 4 >
                scrollContainer.offsetTop + scrollContainer.offsetHeight
            ) {
                scrollContainer.scrollTop += LINE_HEIGHT;
            }
        }
    };
}
