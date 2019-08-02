const express = require("express");
const router = express.Router();
const authService = require('../services/authService');

router.get('/', (req, res) => {
    res.send('You just hit the auth page\n')
})

router.post('/login', (req, res) => authService.login(req, res));

router.post('/register', (req, res) => authService.register(req, res));

router.post('/checkEmailUnique', (req, res) => authService.checkEmailUnique(req, res));

module.exports = router;