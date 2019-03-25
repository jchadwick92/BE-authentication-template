const express = require("express");
const router = express.Router();
const authService = require('../service/authService');

router.get('/', (req, res) => {
    res.send('You just hit the auth page\n')
})

router.post('/login', (req, res) => authService.login(req, res));

router.post('/register', (req, res) => authService.register(req, res));

module.exports = router;