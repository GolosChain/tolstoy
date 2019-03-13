import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Icon from 'components/golos-ui/Icon';
import DialogButton from 'components/common/DialogButton';
import Userpic from 'components/common/Userpic';

export default class DialogFrame extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    className: PropTypes.string,
    buttons: PropTypes.array,
    onCloseClick: PropTypes.func.isRequired,
    username: PropTypes.string,
  };

  render() {
    const { title, titleSize, icon, buttons, children, username, className, style } = this.props;

    return (
      <div className={cn('Dialog', className)} style={style}>
        <Icon name="cross_thin" className="Dialog__close" onClick={this.props.onCloseClick} />
        {title || icon ? (
          <div className="Dialog__header">
            {username ? <Userpic account={username} size={50} /> : null}
            {icon ? (
              <div className="Dialog__header-icon">
                <Icon name={icon} size={40} />
              </div>
            ) : null}
            <div className="Dialog__title" style={titleSize ? { fontSize: titleSize } : null}>
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
