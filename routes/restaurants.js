const mongoose = require('mongoose');
const express = require('express');
const Restaurant  = require('../models/restaurant.js')
var router = express.Router();

/* POST create new restaurant. */
router.post('/', async(req, res) => {

  let restaurant = new Restaurant(req.body)
  restaurant = await restaurant.save((error) => {
    if(error) return handleError(error)
  }); 
  res.send(restaurant);
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