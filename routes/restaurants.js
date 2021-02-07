const express = require("express");
const Restaurant = require("../models/restaurant.js");
const Address = require("../models/address.js");
const { restaurantValidation, addressValidation } = require("../validation");
const router = express.Router();

/* POST create new restaurant document */
router.post("/", async (req, res) => {
  // validate restaurant create data
  const { error } = restaurantValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new restaurant after data validation
  const restaurant = new Restaurant(req.body);
  await restaurant.save((error, restaurant) => {
    if (error) return res.status(400).send(error);
    res.send(restaurant);
  });
});

/* GET get all restaurant documents */
router.get("/", (req, res) => {
  Restaurant.find({}).exec((error, restaurant) => {
    if (error) return handleError(error);
    res.send(restaurant);
  });
});

/* GET get a single restaurant document with populated address field */
router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(400).send("Bad request");
  res.send(restaurant);
});

/* PUT edit a single restaurant document */
router.put("/:id", (req, res) => {
  Restaurant.findByIdAndUpdate(req.params.id, req.body).exec(
    (error, restaurant) => {
      if (error) return handleError(error);
      res.send(restaurant);
    }
  );
});

/* DELETE delete a single restaurant document */
router.delete("/:id", (req, res) => {
  // find and delete restaurant document
  Restaurant.findByIdAndRemove(req.params.id, async (error, restaurant) => {
    if (error) return handleError(error);
    console.log(restaurant.address_id);

    // find and delete related address document
    await Address.findByIdAndRemove(restaurant.address_id);
    res.json({
      status: "restaurant document and related address document deleted",
    });
  });
});

/* POST create new restaurant address document */
router.post("/:id/address/create", async (req, res) => {
  // validate address info
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new user address
  const address = new Address(req.body);
  const saved_address = await address.save();
  if (!saved_address) return res.status(400).send("Unable to save address");

  // find authenticated user document
  Restaurant.findById({ _id: req.params.id }, (error, restaurant) => {
    if (!restaurant) return res.status(400).send("Could not update restaurant");
    restaurant.address_id = saved_address._id;
    restaurant.save();
  });

  res.status(200).send(saved_address);
});

module.exports = router;
