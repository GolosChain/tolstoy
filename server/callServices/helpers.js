import jayson from 'jayson';

const clients = {};

export function callApi(url, method, params = {}) {
    return new Promise((resolve, reject) => {
        let client = clients[url];

        if (!client) {
            client = clients[url] = jayson.client.http(url);
        }

        client.request(method, params, (err, data) => {
            if (err) {
                reject(err);
            } else if (data.error) {
                reject(data.error);
            } else {
                resolve(data.result);
            }
        });
    });
}
