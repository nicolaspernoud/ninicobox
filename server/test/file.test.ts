import * as request from "supertest";
import { app } from "../src/app";



describe("Access explorer without token", () => {
  it("should return 401 Unauthorized status", () => {
    return request(app)
      .get("/api/secured/admin_user/files/rw/..%2Fdata%2Fadmins/explore")
      .set("Accept", "application/json")
      .expect(401);
  });
});

describe("Access explorer with token", () => {
  it("should return 200 Status", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin_user/files/rw/..%2Fdata%2Fadmins/explore")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, done);
      });
  });
});

describe("Access explorer with token but incorrect basepath", () => {
  it("should return 403 Forbidden", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin_user/files/rw/..%2F/explore")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(403, done);
      });
  });
});

describe("Access explorer with token but incorrect path", () => {
  it("should return 403 Forbidden", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin_user/files/rw/..%2Fdata%2Fadmins/..%2F/explore")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(403, done);
      });
  });
});

describe("Create a directory with token", () => {
  it("should return 200 Status", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .post("/api/secured/admin_user/files/rw/..%2Fdata%2Fadmins/createdir")
          .send({ directoryname: "Test"})
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, done);
      });
  });
});

describe("Delete a directory with token", () => {
  it("should return 200 Status", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .delete("/api/secured/admin_user/files/rw/..%2Fdata%2Fadmins/Test")
          .send({isDir: true})
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, done);
      });
  });
});