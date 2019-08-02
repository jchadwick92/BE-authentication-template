const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretOrKey = require('../config/settings').secretOrKey;

router.use((req, res, next) => {
    const payload = getPayload(req.header(token_header));
    if (payload === null) {
        return res.status(403).end();
    } else {
        next();
    }
});

router.use((req, res, next) => { 
    jwt.sign({data: 'data'}, /////////
        secretOrKey,
        {expiresIn: 3600}, 
        (err, token) => {
            res.set(token_header, `Bearer ${token}`); ////
        });
    next();
});

function getPayload(bearerToken) {
    try {
        const token = bearerToken.split(' ')[1];
        return jwt.verify(token, keys.secretOrKey);
    } catch(err) {
        return null;
    }
}

module.exports = router;