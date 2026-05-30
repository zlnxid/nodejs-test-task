require("dotenv").config();

const request = require("supertest");
const createServer = require("../../src/core/server");
const storage = require("../../src/currencies/currency.storage");

const server = createServer();

beforeEach(() => {
    storage.clear();
})

describe("GET /status", () => {

    it("should return ok", async () => {
        const response = await request(server)
            .get("/status")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("ok");
    });
});

describe("Currency CRUD", () => {

    it("should create currency", async () => {
        const response = await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                    name: "Bitcoin",
                    ticker: "BTC"
                }
            );
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe("Bitcoin");
        expect(response.body.ticker).toBe("BTC");
    });

    it("should get all currencies", async () => {
        await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(server)
            .get("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Bitcoin");
        expect(response.body[0].ticker).toBe("BTC");
    });

    it("should get currency by id", async () => {
        const created = await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(server)
            .get(`/currencies/${created.body.id}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Bitcoin");
        expect(response.body.ticker).toBe("BTC");
    });

    it("should update currency", async () => {
        const created = await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(server)
            .put(`/currencies/${created.body.id}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Dollar",
                ticker: "USD"
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Dollar");
        expect(response.body.ticker).toBe("USD");

        const updated = await request(server)
            .get(`/currencies/${created.body.id}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(updated.body.name).toBe("Dollar");
        expect(updated.body.ticker).toBe("USD");
    });

    it("should delete currency", async () => {
        const created = await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(server)
            .delete(`/currencies/${created.body.id}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(204);

        const deleted = await request(server)
            .get(`/currencies/${created.body.id}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(deleted.status).toBe(404);
    });

    it("should return 404 for non-existent", async () => {
        const response = await request(server)
            .get(`/currencies/${1}`)
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(404);
    });

    it("should return 400 for invalid data", async () => {
        const response = await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({});
        expect(response.status).toBe(400);
    });
});

describe("GET /currencies/price", () => {

    it("should return prices for valid currency", async () => {
        await request(server)
            .post("/currencies")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`)
            .send({
                name: "Bitcoin",
                ticker: "BTC"
            });

        const response = await request(server)
            .get("/currencies/price?currency=BTC")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 400 without currency param", async () => {
        const response = await request(server)
            .get("/currencies/price")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(400);
    });

    it("should return 404 for non-existent currency", async () => {
        const response = await request(server)
            .get("/currencies/price?currency=BTC")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(404);
    });
});

describe("Auth middleware", () => {

    it("should return 401 without token", async () => {
        const res = await request(server).get("/status");
        expect(res.status).toBe(401);
    });

    it("should return 403 with wrong token", async () => {
        const res = await request(server)
            .get("/status")
            .set("Authorization", "Bearer wrong");
        expect(res.status).toBe(403);
    });
});