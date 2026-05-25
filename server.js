const express = require('express');
const authMiddleware = require('./auth.middleware');

const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');

const currencyRoutes = require('./currencies/currency.routes');

const createServer = () => {
    const server = express();

    const swaggerDocument = YAML.load('./docs/openapi.yaml');

    server.use(express.json());
    server.use(authMiddleware);

    server.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument)
    );

    server.get("/status", (req, res) => {
        res.status(200).send("ok");
    });

    server.use("/currencies", currencyRoutes);

    return server;
};

module.exports = createServer;