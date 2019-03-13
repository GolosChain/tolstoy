import React from 'react';
import cn from 'classnames';
import { last } from 'ramda';
import tt from 'counterpart';

import KEYS from 'src/app/utils/keyCodes';
import CommonDialog from 'src/app/components-old/dialogs/CommonDialog';
import LoginForm from 'src/app/containers/login/LoginForm';

let queue = [];
let instance = null;
let id = 0;

export default class DialogManager extends React.PureComponent {
  static showDialog(options) {
    if (instance) {
      return instance._showDialog(options);
    } else {
      queue.push(options);

      return {
        close: result => {
          const inQueueIndex = queue.indexOf(options);

          if (inQueueIndex !== -1) {
            queue.splice(inQueueIndex, 1);
          } else if (instance) {
            instance._closeByOptions(options, result);
          }
        },
      };
    }
  }

  static info(text, title) {
    return new Promise(resolve => {
      DialogManager.showDialog({
        component: CommonDialog,
        props: {
          title,
          text,
        },
        onClose: resolve,
      });
    });
  }

  static alert(text, title) {
    DialogManager.showDialog({
      component: CommonDialog,
      props: {
        title,
        type: 'alert',
        text,
      },
    });
  }

  static confirm(text, params = {}) {
    return new Promise(resolve => {
      if (typeof params === 'string') {
        params = {
          title: params,
        };
      }

      DialogManager.showDialog({
        component: CommonDialog,
        props: {
          title: params.title,
          type: 'confirm',
          text: text || tt('g.are_you_sure'),
          params,
        },
        onClose: resolve,
      });
    });
  }

  static dangerConfirm(text, title) {
    return new Promise(resolve => {
      DialogManager.showDialog({
        component: CommonDialog,
        props: {
          title,
          type: 'confirm',
          danger: true,
          text: text || tt('g.are_you_sure'),
        },
        onClose: resolve,
      });
    });
  }

  static prompt(text, title) {
    return new Promise(resolve => {
      DialogManager.showDialog({
        component: CommonDialog,
        props: {
          title,
          type: 'prompt',
          text,
        },
        onClose: resolve,
      });
    });
  }

  static showLogin({
    username,
    forceSave,
    isConfirm,
    operationType,
    loginOperation,
    strictAuthType,
    onClose,
  } = {}) {
    return DialogManager.showDialog({
      component: LoginForm,
      props: {
        username,
        isConfirm,
        forceSave,
        operationType,
        loginOperation,
        strictAuthType,
      },
      onClose,
    });
  }

  static closeAll() {
    if (instance) {
      instance.closeAll();
    } else {
      queue = [];
    }
  }

  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === 'development' && process.env.BROWSER) {
      window.DialogManager = DialogManager;
    }

    instance = this;

    this._dialogs = [];

    this.state = {
      dialogOptions: null,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);

    if (queue.length) {
      for (let dialog of queue) {
        try {
          instance._showDialog(dialog, true);
          instance.forceUpdate();
        } catch (err) {
          console.error(err);
        }
      }
      queue = [];
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown);
  }

  render() {
    if (!this._dialogs.length) {
      return <div className="DialogManager DialogManager_hidden" ref={this._onRef} />;
    }

    const dialogs = this._dialogs.map((dialog, i) => (
      <div
        key={dialog.key}
        className={cn('DialogManager__window-wrapper', {
          'DialogManager__window-wrapper_active': i === this._dialogs.length - 1,
        })}
      >
        <div className="DialogManager__window" onClick={this._onWindowClick}>
          <dialog.options.component
            {...dialog.options.props}
            dialogRoot={this._root}
            ref={el => (dialog.el = (el && el.wrappedInstance) || el)}
            onClose={data => this._onDialogClose(dialog, data)}
          />
        </div>
      </div>
    ));

    return (
      <div className="DialogManager" ref={this._onRef}>
        <div className="DialogManager__shade" ref={this._onShadowRef} />
        {dialogs}
      </div>
    );
  }

  _onRef = el => {
    this._root = el;
  };

  _closeDialog(dialog, data) {
    const index = this._dialogs.indexOf(dialog);

    if (index !== -1) {
      if (dialog.options.onClose) {
        try {
          dialog.options.onClose(data);
        } catch (err) {
          console.error(err);
        }
      }

      this._dialogs.splice(index, 1);
      this.forceUpdate();
    }
  }

  _closeByOptions(options, result) {
    for (let dialog of this._dialogs) {
      if (dialog.options === options) {
        this._closeDialog(dialog, result);
        return;
      }
    }
  }

  _showDialog(options, silent) {
    const dialog = {
      key: ++id,
      options,
    };

    this._dialogs.push(dialog);

    if (!silent) {
      this.forceUpdate();
    }

    return {
      close: result => {
        this._closeDialog(dialog, result);
      },
    };
  }

  _onShadowRef = el => {
    const body = document.body;
    const content = document.getElementById('content');

    if (el) {
      if (window.innerHeight < body.offsetHeight) {
        body.style.overflow = 'hidden';
        content.style['overflow-y'] = 'scroll';
      }
    } else {
      body.style.overflow = '';
      content.style['overflow-y'] = '';
    }
  };

  _onWindowClick = e => {
    const link = e.target.closest('a[href]');

    if (link && link.getAttribute('target') !== '_blank') {
      this.closeAll();
      return;
    }

    if (e.target.classList.contains('DialogManager__window')) {
      this._tryToClose();
    }
  };

  _onDialogClose = (dialog, data) => {
    this._closeDialog(dialog, data);
  };

  _onKeyDown = e => {
    if (this._dialogs.length && e.which === KEYS.ESCAPE) {
      e.preventDefault();
      this._tryToClose();
    }
  };

  _tryToClose() {
    const dialog = last(this._dialogs);

    if (dialog.el && dialog.el.confirmClose) {
      if (!dialog.el.confirmClose()) {
        return;
      }
    }

    this._closeDialog(last(this._dialogs));
  }

  closeAll() {
    for (let i = this._dialogs.length - 1; i >= 0; i--) {
      const dialog = this._dialogs[i];

      if (dialog.options.onClose) {
        try {
          dialog.options.onClose(null);
        } catch (err) {
          console.error(err);
        }
      }
    }

    this._dialogs = [];
    this.forceUpdate();
  }
}
