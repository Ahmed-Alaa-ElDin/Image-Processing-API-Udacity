import supertest from "supertest";
import app from "../index";

const request = supertest(app);

describe("Test Server Endpoints", () => {
    it("should return a 302 status code", async () => {
        const response = await request.get("/");
        expect(response.status).toBe(302);
    });

    // should redirect to /api/image-select
    it("should redirect to /api/image-select", async () => {
        const response = await request.get("/");
        expect(response.header.location).toBe("/api/image-select");
    });

    it("should return a 200 status code", async () => {
        const response = await request.get("/api/image-select");
        expect(response.status).toBe(200);
    });

    it("should return an HTML document", async () => {
        const response = await request.get("/api/image-select");
        expect(response.type).toBe("text/html");
    });
});

describe("Test Sharp Functionalities", () => {
    it("should return a 200 status code", async () => {
        const response = await request.get("/api/images?filename=palmtunnel.jpg&width=1000&height=400");
        expect(response.status).toBe(200);
    });

    it("should return an image", async () => {
        const response = await request.get("/api/images?filename=palmtunnel.jpg&width=1000&height=400");
        expect(response.type).toBe("image/jpeg");
    });
});
