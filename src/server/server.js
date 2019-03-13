const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const path = require('path');

const routes = require('../app/shared/routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: path.resolve(__dirname, '../app') });
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
    const server = express();

    server.use(cookieParser());
    server.use(express.static(path.join(__dirname, '../app/static')));

    server.use(handler).listen(port, err => {
        if (err) {
            throw err;
        }
        // eslint-disable-next-line no-console
        console.log(`> Ready on http://localhost:${port}`);
    });
});
