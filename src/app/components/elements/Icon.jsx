import React from 'react';
import PropTypes from 'prop-types';

// const icons = new Map([
//     ['user', require('src/app/assets/icons/user.svg')],
//     ['share', require('src/app/assets/icons/share.svg')],
//     ['chevron-up-circle', require('src/app/assets/icons/chevron-up-circle.svg')],
//     ['chevron-left', require('src/app/assets/icons/chevron-left.svg')],
//     ['chatboxes', require('src/app/assets/icons/chatboxes.svg')],
//     ['cross', require('src/app/assets/icons/cross.svg')],
//     ['chatbox', require('src/app/assets/icons/chatbox.svg')],
//     ['pencil', require('src/app/assets/icons/pencil.svg')],
//     ['link', require('src/app/assets/icons/link.svg')],
//     ['clock', require('src/app/assets/icons/clock.svg')],
//     ['golos', require('src/app/assets/icons/golos.svg')],
//     ['search', require('src/app/assets/icons/search.svg')],
//     ['menu', require('src/app/assets/icons/menu.svg')],
//     ['empty', require('src/app/assets/icons/empty.svg')],
//     ['flag1', require('src/app/assets/icons/flag1.svg')],
//     ['flag2', require('src/app/assets/icons/flag2.svg')],
//     ['video', require('src/app/assets/icons/video.svg')],
//     ['eye', require('src/app/assets/icons/eye.svg')],
//     ['reblog', require('src/app/assets/icons/reblog.svg')],
//     ['reply', require('src/app/assets/icons/reply.svg')],
//     ['replies', require('src/app/assets/icons/replies.svg')],
//     ['wallet', require('src/app/assets/icons/wallet.svg')],
//     ['arrow', require('src/app/assets/icons/arrow.svg')],
//     ['envelope', require('src/app/assets/icons/envelope.svg')],
//     ['vote', require('src/app/assets/icons/vote.svg')],
//     ['flag', require('src/app/assets/icons/flag.svg')],
//
//     ['vk', require('src/app/assets/icons/vk.svg')],
//     ['lj', require('src/app/assets/icons/lj.svg')],
//     ['facebook', require('src/app/assets/icons/facebook.svg')],
//     ['twitter', require('src/app/assets/icons/twitter.svg')],
//     ['linkedin', require('src/app/assets/icons/linkedin.svg')],
//
//     ['new/vk', require('src/app/assets/icons/new/vk.svg')],
//     ['new/facebook', require('src/app/assets/icons/new/facebook.svg')],
//     ['new/telegram', require('src/app/assets/icons/new/telegram.svg')],
//     ['new/like', require('src/app/assets/icons/new/like.svg')],
//     ['new/wikipedia', require('src/app/assets/icons/new/wikipedia.svg')],
//     ['new/envelope', require('src/app/assets/icons/new/envelope.svg')],
//     ['new/monitor', require('src/app/assets/icons/new/monitor.svg')],
//
//     ['editor/plus-18', require('src/app/assets/icons/editor/plus-18.svg')],
//     ['editor/coin', require('src/app/assets/icons/editor/coin.svg')],
//     ['editor/k', require('src/app/assets/icons/editor/k.svg')],
//     ['editor/share', require('src/app/assets/icons/editor/share.svg')],
//     ['editor/info', require('src/app/assets/icons/editor/info.svg')],
//     ['editor/plus', require('src/app/assets/icons/editor/plus.svg')],
//     ['editor/cross', require('src/app/assets/icons/editor/cross.svg')],
//     ['editor/eye', require('src/app/assets/icons/editor/eye.svg')],
//
//     ['editor-toolbar/bold', require('src/app/assets/icons/editor-toolbar/bold.svg')],
//     ['editor-toolbar/italic', require('src/app/assets/icons/editor-toolbar/italic.svg')],
//     ['editor-toolbar/header', require('src/app/assets/icons/editor-toolbar/header.svg')],
//     ['editor-toolbar/strike', require('src/app/assets/icons/editor-toolbar/strike.svg')],
//     ['editor-toolbar/link', require('src/app/assets/icons/editor-toolbar/link.svg')],
//     ['editor-toolbar/quote', require('src/app/assets/icons/editor-toolbar/quote.svg')],
//     ['editor-toolbar/bullet-list', require('src/app/assets/icons/editor-toolbar/bullet-list.svg')],
//     ['editor-toolbar/number-list', require('src/app/assets/icons/editor-toolbar/number-list.svg')],
//     ['editor-toolbar/picture', require('src/app/assets/icons/editor-toolbar/picture.svg')],
//     ['editor-toolbar/video', require('src/app/assets/icons/editor-toolbar/video.svg')],
//     ['editor-toolbar/search', require('src/app/assets/icons/editor-toolbar/search.svg')],
// ]);

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
    size: PropTypes.oneOf(['0_75x', '0_95x', '1x', '1_25x', '1_5x', '2x', '3x', '4x', '5x', '10x']),
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
        // dangerouslySetInnerHTML={{ __html: icons.get(name) }}
      />
    );
  }
}
