const express = require('express');
const Address = require('../models/address.js')
var router = express.Router();

/* POST create new address */
router.post('/', (req, res) => {
    Address.create(req.body, (error, address) => {
        if (error) return handleError(error);
        res.send(address)
    });
});
