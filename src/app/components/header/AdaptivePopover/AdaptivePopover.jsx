import React from 'react';
import Popover from '../Popover';
import MobilePopover from '../MobilePopover';

export default function AdaptivePopover(props) {
    if (props.isMobile) {
        return <MobilePopover {...props} />;
    } else {
        return <Popover {...props} />;
    }
}
