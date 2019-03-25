process.env.PORT = 5005;
process.env.DB_DSN =
  "mongodb://127.0.0.1:27017/test_users" // $ mongo test_users --host 127.0.0.1 --port 27017

const server = require("../../src/server");
const testHelpers = require("./testHelpers");
const User = require("../../src/users/User");
const bcrypt = require("bcryptjs");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Users", () => {
  let testUser;
  let token;

  before(done => {
    User.deleteMany({}, done);
  });

  before(done => {
    testHelpers
      .createUser("testUser", "user@test.com", "testpass")
      .save((err, user) => {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({ email: "user@test.com", password: "testpass" })
          .end((err, res) => {
            testUser = user;
            token = res.body.token;
            done();
          });
      });
  });

  describe("GET users/me", () => {
    it("should return a 200 and the logged in user", done => {
      chai
        .request(server)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.username).to.equal("testUser");
          done();
        });
    });

    it("should return a 401 if user is not logged in", done => {
      chai
        .request(server)
        .get("/api/users/me")
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe("PUT users/me", () => {
    let testUpdate;
    let tokenUpdate;

    beforeEach(done => {
      testHelpers
        .createUser("testUpdate", "user@update.com", "testupdate")
        .save((err, user) => {
          chai
            .request(server)
            .post("/api/auth/login")
            .send({ email: "user@update.com", password: "testupdate" })
            .end((err, res) => {
              testUpdate = user;
              tokenUpdate = res.body.token;
              done();
            });
        });
    });

    afterEach(done => {
      User.deleteOne({ _id: testUpdate._id }, done);
    });

    it("should return a 200 and update the user's password", done => {
      chai
        .request(server)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${tokenUpdate}`)
        .send({ password: "updatedpassword" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          User.findById(testUpdate.id).then(user => {
            expect(user.email).to.equal("user@update.com");
            expect(bcrypt.compareSync("updatedpassword", user.password)).to.be.true;
            done()
          })
        });
    });

    it("should return a 200 and update the user's email and username", done => {
      chai
      .request(server)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${tokenUpdate}`)
      .send({ email: "updated@email.com", username: "updatedusername" })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        User.findById(testUpdate.id).then(user => {
          expect(user.email).to.equal("updated@email.com");
          expect(user.username).to.equal("updatedusername");
        })
        done()
      })
    })
  });
});
