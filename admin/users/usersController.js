const express = require("express");
const router = express.Router();
const userService = require('./usersService');
const isAdmin = require('../../middleware/isAdmin')

router.get('/', isAdmin, (req, res) => userService.findAll(req, res));

router.get('/:id', isAdmin, (req, res) => userService.findById(req, res))

router.delete('/:id', isAdmin, (req, res) => userService.delete(req, res));

module.exports = router;