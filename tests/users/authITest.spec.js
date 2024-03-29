process.env.PORT = 5005;
process.env.DB_DSN =
  "mongodb://127.0.0.1:27017/test_users"

const server = require("../../src/server");
const User = require("../../src/users/User");
const userRepository = require("../../src/users/repositories/userMongoRepository");
const testHelpers = require('./testHelpers')
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Auth", () => {
  before(done => {
    User.deleteMany({}, done);
  });

  before(done => {
    testHelpers.createUser("testuser", "user@test.com", "testpass")
      .save()
      .then(() => done());
  });

  describe("POST auth/login", () => {
    it("should return a 200 response if the user successfully logs in", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "testpass" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it("should return a 403 response and Invalid email if unknown email used", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "invalid@test.com", password: "pass1" })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.equal("Invalid email");
          done();
        });
    });

    it("should return a 403 response and Invalid password if the password is invalid", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "wrongPassword" })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.equal("Invalid password");
          done();
        });
    });
  });

  describe("POST auth/register", () => {
    it("should return a 201 response and create a new user in the database with a hashed password", done => {
      const newUser = new User({
        username: "testRegister",
        email: "test@register.com",
        password: "testRegister"
      });
      chai
        .request(server)
        .post("/api/auth/register")
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.username).to.equal("testRegister");
          userRepository.findByEmail("test@register.com").then(user => {
            expect(res.body.password).to.equal(user.password);
            expect(res.body.username).to.equal(user.username);
            expect("testRegister").to.not.equal(user.password);
            done();
          });
        });
    });

    it("should return a 400 response if a user with that email already exists", done => {
        const newUser = new User({
            username: "testuser",
            email: "user@test.com",
            password: "testpass"
          });
          chai
          .request(server)
          .post("/api/auth/register")
          .send(newUser)
          .end((err, res) => {
              expect(res.status).to.equal(400);
              expect(res.body.error).to.equal("User with that email already exists")
              done()
          })
    })
  });
});
