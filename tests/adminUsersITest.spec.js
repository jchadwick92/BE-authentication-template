process.env.PORT = 5005;
process.env.DB_DSN =
  "mongodb://test_user:test123@ds233763.mlab.com:33763/mathlab_test";

const server = require("../server");
const testHelpers = require("./testHelpers");
const User = require("../users/User");
const userRespository = require("../users/userMongoRepository");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Admin Users", () => {
  let testAdminUser;
  let token;

  before(done => {
    User.deleteMany({}, done);
  });

  before(done => {
    testHelpers
      .createAdminUser("testAdminUser", "useradmin@test.com", "testpass")
      .save((err, user) => {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({ email: "useradmin@test.com", password: "testpass" })
          .end((err, res) => {
            testAdminUser = user;
            token = res.body.token;
            done();
          });
      });
  });

  describe("GET admin/users", () => {
    it("should return a 200 and a list of all users", done => {
      chai
        .request(server)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a("array");
          done();
        });
    });

    it("should return a 401 if user is not logged in", done => {
      chai
        .request(server)
        .get("/api/admin/users")
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe("GET admin/users/:id", () => {
    it("should return a 200 and a single user", done => {
      chai
        .request(server)
        .get(`/api/admin/users/${testAdminUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.email).to.equal(testAdminUser.email);
          done();
        });
    });

    it("should return a 404 when user is not found", done => {
      chai
        .request(server)
        .get(`/api/admin/users/5c91f9c03a85103ede84ac53`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe("DELETE admin/users/:id", () => {
    it("should return a 204 and delete a user", done => {
      testHelpers
        .createUser("userToDelete", "delete@user.com", "testdelete")
        .save()
        .then(user => {
          chai
            .request(server)
            .delete(`/api/admin/users/${user.id}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              expect(res.status).to.equal(204);
              userRespository.findById(user.id).then(response => {
                expect(response).to.be.null;
                done();
              });
            });
        });
    });
  });
});
