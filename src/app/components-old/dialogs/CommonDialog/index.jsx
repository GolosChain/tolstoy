import React from 'react';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import DialogFrame from 'src/app/components-old/dialogs/DialogFrame';

const TYPES = {
    info: {
        title: 'dialog.info',
    },
    alert: {
        title: 'dialog.alert',
    },
    confirm: {
        title: 'dialog.confirm',
    },
    prompt: {
        title: 'dialog.prompt',
    },
};

export default class CommonDialog extends React.PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['info', 'alert', 'confirm', 'prompt']),
        title: PropTypes.string,
        text: PropTypes.string.isRequired,
        params: PropTypes.object,
        onClose: PropTypes.func.isRequired,
    };

    render() {
        const { text, title, params, type = 'info' } = this.props;

        const options = TYPES[type];

        let style = null;

        if (params && params.width) {
            style = { flexBasis: params.width };
        }

        return (
            <DialogFrame
                className="CommonDialog"
                title={title || tt(options.title)}
                buttons={this._getButtons()}
                style={style}
                onCloseClick={this._onCloseClick}
            >
                <div className="CommonDialog__body">
                    {format(text)}
                    {type === 'prompt' ? (
                        <input className="CommonDialog__prompt-input" ref="input" autoFocus />
                    ) : null}
                </div>
            </DialogFrame>
        );
    }

    _getButtons() {
        const { type, danger } = this.props;

        if (type === 'prompt') {
            return [
                {
                    text: tt('g.cancel'),
                    onClick: this._onCloseClick,
                },
                { text: tt('g.ok'), primary: true, onClick: this._onOkClick },
            ];
        }

        if (type === 'confirm') {
            return [
                {
                    text: tt('g.cancel'),
                    onClick: this._onCloseClick,
                },
                {
                    text: tt('g.ok'),
                    primary: true,
                    warning: danger,
                    autoFocus: true,
                    onClick: this._onOkClick,
                },
            ];
        }

        if (type === 'alert') {
            return [
                {
                    text: tt('g.ok'),
                    warning: true,
                    autoFocus: true,
                    onClick: this._onOkClick,
                },
            ];
        }

        return [
            {
                text: tt('g.ok'),
                primary: true,
                autoFocus: true,
                onClick: this._onOkClick,
            },
        ];
    }

    _onOkClick = () => {
        const { type, onClose } = this.props;

        if (type === 'prompt') {
            onClose(this.refs.input.value);
        } else if (type === 'confirm') {
            onClose(true);
        } else {
            onClose();
        }
    };

    _onCloseClick = () => {
        this.props.onClose();
    };
}

function format(text) {
    const lines = text.split('\n');

    if (lines.length === 1) {
        return text;
    }

    const components = [];

    for (let i = 0; i < lines.length; ++i) {
        components.push(lines[i]);

        if (i !== lines.length - 1) {
            components.push(<br key={i} />);
        }
    }

    return components;
}
