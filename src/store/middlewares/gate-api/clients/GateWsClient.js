import { Client } from 'rpc-websockets';

import GateError from '../GateError';

export default class GateWsClient {
  constructor() {
    this.queue = [];

    this.url = process.env.GATE_CONNECT;

    if (!this.url) {
      // eslint-disable-next-line no-console
      console.error('Env variable "GATE_CONNECT" hasn\'t set');
      return;
    }

    this.connect().catch(err => {
      // eslint-disable-next-line no-console
      console.error('WebSocket connect failed:', err);
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      const socket = new Client(this.url);

      let connected = false;

      socket.on('open', () => {
        connected = true;
        this.socket = socket;
        resolve();

        this.flushQueue();
      });

      socket.on('error', err => {
        // eslint-disable-next-line no-console
        console.error('WebSocket disconnected:', err);
        reject(err);

        if (connected) {
          this.close();
          this.connect();
        }
      });
    });
  }

  close() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch (err) {
        // Ignore errors when closing
      }

      this.socket = null;
    }
  }

  flushQueue() {
    for (const item of this.queue) {
      clearTimeout(item.timeoutId);
      item.resolve(this.callApi(item.apiName, item.params));
    }
    this.queue = [];
  }

  callApi(apiName, params) {
    if (!this.socket) {
      return new Promise((resolve, reject) => {
        const delayedItem = {
          apiName,
          params,
          resolve,
          reject,
          timeoutId: setTimeout(() => {
            this.queue = this.queue.filter(item => item !== delayedItem);
            reject(new Error('Queue timeout error'));
          }, 5000),
        };

        this.queue.push(delayedItem);
      });
    }

    return this.socketCall(apiName, params);
  }

  async socketCall(apiName, params) {
    try {
      return await this.socket.call(apiName, params);
    } catch (err) {
      throw new GateError(err);
    }
  }
}
