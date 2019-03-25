const userRepository = require('../repositories/userMongoRepository');
const bcrypt = require('bcryptjs');

module.exports = {
    findByLoggedInUser: (req, res) => {
        userRepository.findById(req.user.id).then(user => {
            if (!user) {
                return res.status(404).json("No user found");
              }
            return res.json(user)
        })
        .catch(() => console.log(""));
    },

    update: (req, res) => {
        userRepository.findById(req.user.id).then(user => {
            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            if (req.body.password) {
                bcrypt.hash(req.body.password, 10).then(hashedPassword => {
                    user.password = hashedPassword;
                    user.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err))
                })
            } else {
                user.save()
                .then(user => res.json(user))
                .catch(err => console.log(err))
            }
        })
    }
}