const request = require("supertest");
const createServer = require("./server");
const server = createServer();

describe("GET /status", () => {

    it("should return ok", async () => {
        const response = await request(server).get("/status");

        expect(response.status).toBe(200);
        expect(response.text).toBe("ok");
    });
});