const express = require('express');
const Restaurant  = require('../models/restaurant.js')
const Address = require('../models/address.js')
var router = express.Router();

/* POST create new restaurant document */
router.post('/', async(req, res) => {
  var address = new Address(req.body.address)
  address.save((error) => {
    if (error) return handleError(error);
    Restaurant
    .create({ 
      address_id: address._id, 
      name: req.body.name, 
      phoneNumber: req.body.phoneNumber, 
      email: req.body.email
    }, 
    (restaurant) => {
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
    .findByIdAndUpdate(req.params.id, req.body)
    .exec((error, restaurant) => { 
      if (error) return handleError(error)
      res.send(restaurant) 
    });
});

/* DELETE delete a single restaurant document */
router.delete('/:id', (req, res) => {
  Restaurant
    .findByIdAndRemove(req.params.id)
    .exec((error) => { 
      if (error) return handleError(error)
      res.json({"status": "restaurant deleted"}) 
    });
});

/* PUT edit restaurant address */
router.put('/:rest_id/:add_id', (req, res) => {
  Address
    .findByIdAndUpdate(req.params.add_id, req.body, (error, address) => { 
      if (error) return handleError(error)
       Restaurant.findByIdAndUpdate(req.params.rest_id, { address_id: address._id}, (error) => {
        if (error){
          next(error);
        }
      });
      res.send(address);
    });
});

module.exports = router;