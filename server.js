const express = require('express');
const authMiddleware = require('./auth.middleware');

const createServer = () => {
    const server = express();

    server.use(express.json());

    server.use(authMiddleware);

    server.get("/status", (req, res) => {
        res.status(200).send("ok");
    });

    return server;

}
module.exports = createServer;