const express = require('express');
const Restaurant  = require('../models/restaurant.js')
const Address = require('../models/address.js')
var router = express.Router();

/* POST create new restaurant document */
router.post('/', async(req, res) => {
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

/* GET get all restaurant documents */
router.get('/', (req, res) => {
  Restaurant
    .find({})
    .exec((error, restaurant) => {
      if (error) return handleError(error);
      res.send(restaurant)
    });
  
});

/* GET get a single restaurant document with populated address field */
router.get('/:id', (req, res) => {
  Restaurant
    .findById(req.params.id)
    .populate('address_id')
    .exec((error, restaurant) => {
      if (error) return handleError(error);
      res.send(restaurant)
    });
  
});

/* PUT edit a single restaurant document */
router.put('/:id', (req, res) => {
    Restaurant
    .findByIdAndUpdate(req.params.id, req.body, {new: true})
    .exec((error, restaurant) => { 
      if (error) handleError(error)
      res.send(restaurant) 
    });
});

/* DELETE delete a single restaurant document */
router.delete('/:id', (req, res) => {
  Restaurant
    .findByIdAndRemove(req.params.id)
    .exec((error) => { 
      if (error) handleError(error)
      res.json({"status": "restaurant deleted"}) 
    });
});

/* PUT edit restaurant address id */
router.put('/:id', (req, res) => {
  var restaurant = Restaurant.findById(req.params.id)
  Address
    .findByIdAndUpdate(restaurant.address_id, req.body)
    .exec((error, address) => { 
      if (error) handleError(error)
      res.send(address) 
    });
});

module.exports = router;