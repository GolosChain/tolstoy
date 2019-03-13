import { Client } from 'rpc-websockets';
import { getStoreState } from 'src/app/clientRender';

let socketPromise = null;

export function connect() {
  return new Promise(resolve => {
    const gateServiceUrl = getStoreState().offchain.getIn(['config', 'gate_service_url']);

    const socket = new Client(gateServiceUrl);

    socket.on('open', () => {
      resolve(socket);
    });
  });
}

export function getGateSocket() {
  if (!socketPromise) {
    socketPromise = connect();
  }

  return socketPromise;
}

export function reconnectGateSocket() {
  socketPromise = null;

  return getGateSocket();
}
