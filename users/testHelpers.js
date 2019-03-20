const bcrypt = require('bcryptjs');

module.exports = {
    createUser: (username, email, password) => {
        return new User({
          username: username,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        });
      },

    createAdminUser: (username, email, password) => {
      return new User({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
        admin: true
      });
    }
}
