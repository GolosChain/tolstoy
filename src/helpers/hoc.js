import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import capitalize from 'lodash/capitalize';
import authProtect from './hoc/authProtection';

let listenWrapper;
let listenLazyWrapper;

if (process.env.BROWSER) {
  listenWrapper = createWrapper();
  listenLazyWrapper = createWrapper(true);
} else {
  // noop for server rendering
  listenWrapper = () => Comp => Comp;
  listenLazyWrapper = () => Comp => Comp;
}

function createWrapper(isLazy) {
  const handles = new Set();
  const listeners = new Map();

  return (...events) => Comp => {
    if (Array.isArray(events[0])) {
      events = events[0];
    }

    return class Listener extends Component {
      componentDidMount() {
        for (let event of events) {
          if (!handles.has(event)) {
            let eventListener = e => {
              callHandlers(listeners, event, e);
            };

            if (isLazy) {
              eventListener = throttle(eventListener, 100);
            }

            window.addEventListener(event, eventListener);
            handles.add(event);
          }

          let components = listeners.get(event);

          if (!components) {
            components = [];
            listeners.set(event, components);
          }

          components.push(this._inner);
        }
      }

      componentWillUnmount() {
        for (let event of events) {
          const components = listeners.get(event);

          const index = components.indexOf(this._inner);

          if (index !== -1) {
            components.splice(index, 1);
          }
        }
      }

      render() {
        return <Comp {...this.props} ref={this._onRef} forwardRef={this._onRef} />;
      }

      _onRef = el => {
        if (el && this._inner) {
          return;
        }

        if (!el && !this._inner) {
          return;
        }

        this._inner = el;

        if (this.props.forwardRef) {
          this.props.forwardRef(el);
        }
      };
    };
  };
}

function callHandlers(listeners, eventName, e) {
  const components = listeners.get(eventName);

  if (components) {
    const handlerName = `on${capitalize(eventName)}`;

    for (let component of components) {
      if (component[handlerName]) {
        try {
          component[handlerName](e);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

export const listen = listenWrapper;
export const listenLazy = listenLazyWrapper;
export const authProtection = authProtect;
