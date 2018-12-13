import { Client } from 'rpc-websockets';

let socket = null;

export function connect(connectionString) {
    return new Promise(resolve => {
        socket = new Client(connectionString);
        socket.on('open', () => resolve(socket));
    });
}

export function getGateSocket() {
    return socket;
}
