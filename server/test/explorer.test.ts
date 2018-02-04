import * as request from "supertest";
import { app } from "../src/app";



describe("Access explorer without token", () => {
  it("should return 401 Unauthorized status", () => {
    return request(app)
      .get("/api/secured/admin_user/files/explore")
      .set("Accept", "application/json")
      .expect(401);
  });
});

describe("Access explorer with token", () => {
  it("should return 202 Status", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin_user/files/explore")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, done);
      });
  });
});