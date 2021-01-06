const mongoose = require('mongoose');
const express = require('express');
const Restaurant  = require('/Users/Rem_files/Desktop/Web_dev/node/SwiftMeal-BackEnd/models/restaurant.js')
var router = express.Router();

/* POST create new restaurant. */
router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let restaurant = new Restaurant(req.body)
    restaurant = await restaurant.save();

  res.send(restaurant);
});

module.exports = router;