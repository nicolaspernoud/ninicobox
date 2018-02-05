import * as request from "supertest";
import { app } from "../src/app";
import { setUsers, getUsers } from "../src/models/users";

const usersIn = [
  {
    "id": 1,
    "login": "admin",
    "name": "Ad",
    "surname": "MIN",
    "password": "password",
    "role": "admin"
  },
  {
    "id": 2,
    "login": "user",
    "name": "Us",
    "surname": "ER",
    "password": "password",
    "role": "user"
  }
];

// Initialise user database
setUsers(usersIn);

// Get stored results with hashed passwords
const usersOut = getUsers();

describe("GET /", () => {
  it("should return 200 OK", () => {
    return request(app).get("/")
      .expect(200);
  });
});

describe("GET /random-url", () => {
  it("should return 404", (done) => {
    request(app).get("/reset")
      .expect(404, done);
  });
});

describe("Authenticate with correct admin credentials", () => {
  it("should return a token", () => {
    return request(app)
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .expect(loginResponseIsOK);
  });
});

describe("Authenticate with incorrect admin credentials", () => {
  it("should return 401 Unauthorized status", () => {
    return request(app)
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "badpassword" })
      .expect(401);
  });
});

describe("GET users without authentication", () => {
  it("should return 401 Unauthorized", () => {
    return request(app).get("/api/secured/admin/users")
      .expect(401);
  });
});

describe("GET users on admin route with user authentication", () => {
  it("should return 403 Forbidden", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "user", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin/users")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(403, done);
      });
  });
});

describe("GET users on user route with user authentication", () => {
  it("should return 404 Not Found", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "user", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/user/users")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(404, done);
      });
  });
});

describe("GET users with admin authentication", () => {
  it("should return 200 OK and users body", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .get("/api/secured/admin/users")
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200)
          .expect(/\[.+\]/, done);
      });
  });
});

describe("POST users without authentication", () => {
  it("should return 401 Unauthorized", (done) => {
    request(app)
      .post("/api/secured/admin/users")
      .send(usersIn)
      .expect(401, done);
  });
});

describe("POST users with admin authentication", () => {
  it("should return 200 OK and users in body", (done) => {
    const agent = request(app);
    agent
      .post("/api/unsecured/login")
      .send({ "login": "admin", "password": "password" })
      .end((req, res) => {
        agent
          .post("/api/secured/admin/users")
          .send(usersIn)
          .set("Accept", "application/json")
          .set("Authorization", "JWT " + res.body.token)
          .expect(200, usersOut, done);
      });
  });
});

function loginResponseIsOK(res) {
  if (res.body.message !== "ok") throw new Error("incorrect message");
  if (!("token" in res.body)) throw new Error("missing token key in body");
}