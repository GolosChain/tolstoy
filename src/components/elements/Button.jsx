import React, { Component } from 'react';
import cn from 'classnames';

export default class Button extends Component {
  static defaultProps = {
    round: false,
    type: 'primary',
  };

  render() {
    const { onClick, children, type, round, className } = this.props;

    const btnClasses = cn('golos-btn', className, `btn-${type}`, {
      'btn-round': round,
    });

    return (
      <button className={btnClasses} onClick={onClick} role="button">
        {children}
      </button>
    );
  }
}
