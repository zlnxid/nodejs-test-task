require("dotenv").config();

const request = require("supertest");
const createServer = require("./server");

const server = createServer();

describe("GET /status", () => {

    it("should return ok", async () => {
        const response = await request(server)
            .get("/status")
            .set("Authorization", `Bearer ${process.env.AUTH_TOKEN}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("ok");
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