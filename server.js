const express = require('express');

const createServer = () => {
    const server = express();

    server.use(express.json());

    server.get("/status", (req, res) => {
        res.status(200).send("ok");
    });

    return server;

}
module.exports = createServer;