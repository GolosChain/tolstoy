class EventEmitter {
  listeners = {};

  emit(eventName, params) {
    const list = this.listeners[eventName];

    for (let callback of list) {
      callback(params);
    }
  }

  on(eventName, callback) {
    const list = (this.listeners[eventName] = this.listeners[eventName] || new Set());
    list.add(callback);
  }

  off(eventName, callback) {
    const list = this.listeners[eventName];
    if (list) {
      list.delete(callback);
    }
  }
}

export default new EventEmitter();
