const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const userRepository = require('../users/userMongoRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretOrKey = require('../config/settings').secretOrKey;

module.exports = {
    login: (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);
        if(!isValid) {
            return res.status(400).json(errors);
        }
        userRepository.findByEmail(req.body.email)
        .then(user => {
            if (!user) {
                return res.status(401).json("No user found")
            }
            bcrypt.compare(req.body.password, user.password)
            .then(match => {
                if (!match) {
                    return res.status(401).json("Invalid password")
                }
                const options = { expiresIn: 3600 };
                const payload = { id: user.id };
                jwt.sign(payload, secretOrKey, options, (err, token) => {
                    res.json({
                        message: "Authentication successful",
                        token: token
                      })
                })
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    },

    register: (req, res) => {
        const { errors, isValid } = validateRegisterInput(req.body);
        if(!isValid) {
            return res.status(400).json(errors);
        }
        userRepository.findByEmail(req.body.email)
        .then(user => {
            if(user) {
                return res.status(400).json({error: "User with that email already exists"}) 
            }
            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
            bcrypt.hash(newUser.password, 10)
            .then(hashedPassword => {
                newUser.password = hashedPassword
                userRepository.create(newUser)
                .then(user => res.json(user))
                .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }
};