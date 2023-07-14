const express = require("express");
const Restaurant = require("../models/restaurant.js");
const Address = require("../models/address.js");
const { auth, grantAccess } = require("./authController");
const { roles } = require("../role");
const { restaurantValidation, addressValidation } = require("../validation");
const router = express.Router();

/* POST create new restaurant document */
router.post(
  "/",
  auth,
  grantAccess("createAny", "restaurant"),
  async (req, res) => {
    // validate restaurant create data
    const { error } = restaurantValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new restaurant after data validation
    Restaurant.create(req.body, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);

/* GET get all restaurant documents */
router.get(
  "/",
  auth,
  grantAccess("readAny", "restaurant"),
  async (req, res) => {
    Restaurant.find({}).exec((error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);

/* GET get a single restaurant document with populated address field */
router.get(
  "/:id",
  auth,
  grantAccess("readAny", "restaurant"),
  async (req, res) => {
    // Find restaurant document
    await Restaurant.findById(req.params.id, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);

/* PUT edit a single restaurant document */
router.put(
  "/:id",
  auth,
  grantAccess("updateAny", "restaurant"),
  async (req, res) => {
    // validate restaurant create data
    const { error } = restaurantValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find and update restaurant document
    await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (error, restaurant) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(restaurant);
      }
    );
  }
);

/* DELETE delete a single restaurant document */
router.delete(
  "/:id",
  grantAccess("deleteAny", "restaurant"),
  auth,
  async (req, res) => {
    console.log('i got here')
    // find and delete restaurant document
    Restaurant.findByIdAndRemove(req.params.id, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });

      // find and delete related address document
      // Address.findByIdAndRemove(restaurant.addressId);
      res.status(200).json({ status: "Success" });
    });
  }
);

/* POST create new restaurant address document */
router.post(
  "/:id/address/create",
  grantAccess("createOwn", "address"),
  auth,
  async (req, res) => {
    // validate address info
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new user address
    const address = new Address(req.body);
    const saved_address = await address.save();
    if (!saved_address) return res.status(400).send("Unable to save address");

    Restaurant.findById({ _id: req.params.id }, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      if (!restaurant)
        return res.status(400).json({ error: "Restaurant does not exist" });
      restaurant.addressId = saved_address._id;
      restaurant.save();
    });

    res.status(200).send(saved_address);
  }
);

module.exports = router;
