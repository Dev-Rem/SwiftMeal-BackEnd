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

/* GET get all address documents */
router.get('/', (req, res) => {
    Address.find((error, address) => {
        if (error) return handleError(error);
        res.send(address)
    });
});

/* GET get a single address document */
router.get('/:id', (req, res) => {
    Address.findById(req.params.id, (error, address) => {
        if (error) return handleError(error);
        res.send(address)
    });
});

/* PUT edit a single address document */
router.put('/:id', (req, res) => {
    Address
    .findByIdAndUpdate(req.params.id, req.body)
    .exec((error, address) => { 
      if (error) return handleError(error)
      res.send(address) 
    });
});

/* DELETE delete an address document */
router.delete('/:id', (req, res) => {
    Address.findByIdAndRemove(req.params.id, (error, address) => {
        if (error) return handleError(error);
        res.send({status: "address deleted", address_id: address._id})
    });
});

module.exports = router;
