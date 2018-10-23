import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Icon from 'golos-ui/Icon';
import DialogButton from 'src/app/components/common/DialogButton';

export default class DialogFrame extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string,
        buttons: PropTypes.array,
        onCloseClick: PropTypes.func.isRequired,
    };

    render() {
        const { title, titleSize, icon, buttons, children, className } = this.props;

        return (
            <div className={cn('Dialog', className)}>
                <Icon
                    name="cross_thin"
                    className="Dialog__close"
                    onClick={this.props.onCloseClick}
                />
                {title || icon ? (
                    <div className="Dialog__header">
                        {icon ? (
                            <div className="Dialog__header-icon">
                                <Icon name={icon} size={40} />
                            </div>
                        ) : null}
                        <div
                            className="Dialog__title"
                            style={titleSize ? { fontSize: titleSize } : null}
                        >
                            {title}
                        </div>
                    </div>
                ) : null}
                <div className="Dialog__content">{children}</div>
                {buttons && buttons.length ? (
                    <div className="Dialog__footer">
                        {buttons.map((button, i) => (
                            <DialogButton key={i} {...button} />
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}
