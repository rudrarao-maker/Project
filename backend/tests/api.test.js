const request = require("supertest");
const app = require("../src/app");

describe("API Endpoints Integration", () => {
  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/api/unknown_route_123");
    expect(res.statusCode).toEqual(404);
  });

  it("should fail login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test_non_existent@example.com",
        password: "wrongpassword123"
      });
    expect(res.statusCode).toEqual(401);
  });
});
