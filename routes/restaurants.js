const mongoose = require('mongoose');
const express = require('express');
const Restaurant  = require('../models/restaurant.js')
const Address = require('../models/address.js')
var router = express.Router();

/* POST create new restaurant. */
router.post('/', async(req, res) => {
  console.log(req.body.address)
  var address = new Address(req.body.address)
  address.save((error) => {
    if (error) handleError(error);
    Restaurant.create(
    { address_id: address._id, name: req.body.name, phoneNumber: req.body.phoneNumber, email: req.body.email}, 
    (error, restaurant) => {
      if(error) return handleError(error)
      res.send(restaurant);
    });
  })   
});

router.get('/', (req, res) => {
  Restaurant
    .find({})
    .exec((error, restaurant) => {
      if (error) return handleError(error);
      res.send(restaurant)
    });
  
});

router.get('/:id', (req, res) => {
  Restaurant
    .findById(req.params.id)
    .populate('address_id')
    .exec((error, restaurant) => {
      if (error) return handleError(error);
      res.send(restaurant)
    });
  
});

router.put('/:id', (req, res) => {
    Restaurant
    .findByIdAndUpdate(req.params.id, req.body, {new: true})
    .exec((error, restaurant) => { 
      if (error) handleError(error)
      res.send(restaurant) 
    });
});

router.delete('/:id', (req, res) => {
  Restaurant
    .findByIdAndRemove(req.params.id)
    .exec((error) => { 
      if (error) handleError(error)
      res.json({"status": "restaurant deleted"}) 
    });
});

module.exports = router;