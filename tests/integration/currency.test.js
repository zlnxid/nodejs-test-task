require("dotenv").config();

const request = require('supertest');

const createServer = require('../../src/core/server');

const repository = require('../../src/currencies/currency.repository');

describe('Currency API', () => {

    let server;

    beforeEach(async () => {
        await repository.clear();
        server = createServer();
    });

    const authHeader = {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`
    };

    test('POST /currencies', async () => {

        const response = await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Dollar',
                ticker: 'USD'
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.name).toBe('Dollar');
    });

    test('GET /currencies', async () => {

        await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Dollar',
                ticker: 'USD'
            });

        const response = await request(server)
            .get('/currencies')
            .set(authHeader);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    test('GET /currencies/:id', async () => {

        const created = await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Euro',
                ticker: 'EUR'
            });

        const response = await request(server)
            .get(`/currencies/${created.body.id}`)
            .set(authHeader);

        expect(response.statusCode).toBe(200);

        expect(response.body.ticker).toBe('EUR');
    });

    test('PUT /currencies/:id', async () => {

        const created = await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Euro',
                ticker: 'EUR'
            });

        const response = await request(server)
            .put(`/currencies/${created.body.id}`)
            .set(authHeader)
            .send({
                name: 'US Dollar'
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.name).toBe('US Dollar');
    });

    test('DELETE /currencies/:id', async () => {

        const created = await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Euro',
                ticker: 'EUR'
            });

        const response = await request(server)
            .delete(`/currencies/${created.body.id}`)
            .set(authHeader);

        expect(response.statusCode).toBe(204);
    });

    test('GET /currencies/price', async () => {

        await request(server)
            .post('/currencies')
            .set(authHeader)
            .send({
                name: 'Bitcoin',
                ticker: 'BTC'
            });

        const response = await request(server)
            .get('/currencies/price?currency=BTC')
            .set(authHeader);

        expect(response.statusCode).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });
});