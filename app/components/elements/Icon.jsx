import React from 'react';
import PropTypes from 'prop-types';

const icons = new Map([
    ['user', require('app/assets/icons/user.svg')],
    ['share', require('app/assets/icons/share.svg')],
    ['chevron-up-circle', require('app/assets/icons/chevron-up-circle.svg')],
    ['chevron-left', require('app/assets/icons/chevron-left.svg')],
    ['chatboxes', require('app/assets/icons/chatboxes.svg')],
    ['cross', require('app/assets/icons/cross.svg')],
    ['chatbox', require('app/assets/icons/chatbox.svg')],
    ['pencil', require('app/assets/icons/pencil.svg')],
    ['link', require('app/assets/icons/link.svg')],
    ['clock', require('app/assets/icons/clock.svg')],
    ['extlink', require('app/assets/icons/extlink.svg')],
    ['golos', require('app/assets/icons/golos.svg')],
    ['search', require('app/assets/icons/search.svg')],
    ['menu', require('app/assets/icons/menu.svg')],
    ['empty', require('app/assets/icons/empty.svg')],
    ['flag1', require('app/assets/icons/flag1.svg')],
    ['flag2', require('app/assets/icons/flag2.svg')],
    ['video', require('app/assets/icons/video.svg')],
    ['eye', require('app/assets/icons/eye.svg')],
    ['reblog', require('app/assets/icons/reblog.svg')],
    ['reply', require('app/assets/icons/reply.svg')],
    ['replies', require('app/assets/icons/replies.svg')],
    ['wallet', require('app/assets/icons/wallet.svg')],
    ['arrow', require('app/assets/icons/arrow.svg')],
    ['envelope', require('app/assets/icons/envelope.svg')],
    ['vote', require('app/assets/icons/vote.svg')],
    ['flag', require('app/assets/icons/flag.svg')],

    ['vk', require('app/assets/icons/vk.svg')],
    ['lj', require('app/assets/icons/lj.svg')],
    ['facebook', require('app/assets/icons/facebook.svg')],
    ['twitter', require('app/assets/icons/twitter.svg')],
    ['linkedin', require('app/assets/icons/linkedin.svg')],

    ['new/vk', require('app/assets/icons/new/vk.svg')],
    ['new/facebook', require('app/assets/icons/new/facebook.svg')],
    ['new/telegram', require('app/assets/icons/new/telegram.svg')],
    ['new/like', require('app/assets/icons/new/like.svg')],
    ['new/wikipedia', require('app/assets/icons/new/wikipedia.svg')],
    ['new/envelope', require('app/assets/icons/new/envelope.svg')],
    ['new/monitor', require('app/assets/icons/new/monitor.svg')],

    ['editor/plus-18', require('app/assets/icons/editor/plus-18.svg')],
    ['editor/coin', require('app/assets/icons/editor/coin.svg')],
    ['editor/share', require('app/assets/icons/editor/share.svg')],
    ['editor/info', require('app/assets/icons/editor/info.svg')],
    ['editor/plus', require('app/assets/icons/editor/plus.svg')],
    ['editor/cross', require('app/assets/icons/editor/cross.svg')],
    ['editor/eye', require('app/assets/icons/editor/eye.svg')],

    ['editor-toolbar/bold', require('app/assets/icons/editor-toolbar/bold.svg')],
    ['editor-toolbar/italic', require('app/assets/icons/editor-toolbar/italic.svg')],
    ['editor-toolbar/header', require('app/assets/icons/editor-toolbar/header.svg')],
    ['editor-toolbar/strike', require('app/assets/icons/editor-toolbar/strike.svg')],
    ['editor-toolbar/link', require('app/assets/icons/editor-toolbar/link.svg')],
    ['editor-toolbar/quote', require('app/assets/icons/editor-toolbar/quote.svg')],
    ['editor-toolbar/bullet-list', require('app/assets/icons/editor-toolbar/bullet-list.svg')],
    ['editor-toolbar/number-list', require('app/assets/icons/editor-toolbar/number-list.svg')],
    ['editor-toolbar/picture', require('app/assets/icons/editor-toolbar/picture.svg')],
    ['editor-toolbar/video', require('app/assets/icons/editor-toolbar/video.svg')],
    ['editor-toolbar/search', require('app/assets/icons/editor-toolbar/search.svg')],
]);

const rem_sizes = {
    '0_75x': '0.75',
    '0_95x': '0.95',
    '1x': '1.12',
    '1_25x': '1.25',
    '1_5x': '1.5',
    '1_75x': '1.75',
    '2x': '2',
    '3x': '3.45',
    '4x': '4.60',
    '5x': '5.75',
    '10x': '10.0',
};

export default class Icon extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        size: PropTypes.oneOf([
            '0_75x',
            '0_95x',
            '1x',
            '1_25x',
            '1_5x',
            '2x',
            '3x',
            '4x',
            '5x',
            '10x',
        ]),
    };

    render() {
        const { name, size, className } = this.props;
        let classes = 'Icon ' + name;
        let style;

        if (size) {
            classes += ' Icon_' + size;
            style = { width: `${rem_sizes[size]}rem` };
        }

        if (className) {
            classes += ' ' + className;
        }

        const passProps = { ...this.props };
        delete passProps.name;
        delete passProps.size;
        delete passProps.className;

        return (
            <span
                {...passProps}
                className={classes}
                style={style}
                dangerouslySetInnerHTML={{ __html: icons.get(name) }}
            />
        );
    }
}
