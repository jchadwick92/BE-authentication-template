process.env.PORT = 5005;
process.env.DB_DSN =
  "mongodb://test_user:test123@ds233763.mlab.com:33763/mathlab_test";

const server = require("../server");
const User = require("../users/User");
const userRepository = require("../users/userMongoRepository");
const testHelpers = require('../users/testHelpers')
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Auth", () => {
  before(done => {
    User.remove({}, done);
  });

  before(done => {
    testHelpers.createUser("testuser", "user@test.com", "testpass")
      .save()
      .then(() => done());
  });

  describe("auth/login", () => {
    it("should return a 200 response if the user is logged in", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "testpass" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it("should return a 401 response and No User found error if unknown username used", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "invalid@test.com", password: "pass1" })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.equal("No user found");
          done();
        });
    });

    it("should return a 401 response and Invalid password if the password is invalid", done => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({ email: "user@test.com", password: "wrongPassword" })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.equal("Invalid password");
          done();
        });
    });
  });

  describe("auth/register", () => {
    it("should create a new user in the database with a hashed password", done => {
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
          expect(res.status).to.equal(200);
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
