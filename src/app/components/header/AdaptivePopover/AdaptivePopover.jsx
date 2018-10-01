import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MobilePopover from './../MobilePopover';
import Popover from './../Popover';

export default class AdaptivePopover extends PureComponent {
    static propTypes = {
        isMobile: PropTypes.bool,
        target: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired,
    }

    render() {
        const { isMobile, target, onClose, children } = this.props;

        if (isMobile) {
            return <MobilePopover target={target} onClose={onClose}>{children}</MobilePopover>;
        } else {
            return <Popover target={target} onClose={onClose}>{children}</Popover>;
        }
    }
}
