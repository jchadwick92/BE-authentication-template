const express = require("express");
const router = express.Router();
const userService = require('./usersService');

router.get("/me", (req, res) => userService.findByLoggedInUser(req, res));

router.put("/me", (req, res) => userService.update(req, res));

module.exports = router