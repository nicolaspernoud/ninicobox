import * as request from "supertest";
import { app } from "../src/app";

describe("GET /api/secured/admin/proxy?url=[http://example.com/] without authentication", () => {
  it("should return 401 Unauthorized", () => {
    return request(app).get("/api/secured/admin/proxy?url=[http://example.com/]")
      .expect(401);
  });
});

describe("GET /api/secured/admin/proxy?url=[http://example.com/] with authentication", () => {
  it("should return 200 OK", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin/proxy?url=[http://example.com/]")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, done);
      });
  });
});