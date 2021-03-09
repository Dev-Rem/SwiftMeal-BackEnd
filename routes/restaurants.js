const express = require("express");
const Restaurant = require("../models/restaurant.js");
const Address = require("../models/address.js");
const { auth } = require("./authController");
const { roles } = require("../role");
const { restaurantValidation, addressValidation } = require("../validation");
const router = express.Router();

/* POST create new restaurant document */
router.post("/create", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).createAny("restaurant");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // validate restaurant create data
  const { error } = restaurantValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new restaurant after data validation
  const restaurant = new Restaurant(req.body);
  restaurant.save((error, restaurant) => {
    if (error) return res.status(400).json({ error: error });
    res.send(restaurant);
  });
});

/* GET get all restaurant documents */
router.get("/", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).readAny("restaurant");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  Restaurant.find({}).exec((error, restaurant) => {
    if (error) return res.status(400).json({ error: error });
    res.send(restaurant);
  });
});

/* GET get a single restaurant document with populated address field */
router.get("/:id", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).readAny("restaurant");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(400).send("Bad request");
  res.send(restaurant);
});

/* PUT edit a single restaurant document */
router.put("/:id", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).updateAny("restaurant");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // validate restaurant create data
  const { error } = restaurantValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec(
    (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.send(restaurant);
    }
  );
});

/* DELETE delete a single restaurant document */
router.delete("/:id", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).deleteAny("restaurant");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // find and delete restaurant document
  Restaurant.findByIdAndRemove(req.params.id, async (error, restaurant) => {
    if (error) return res.status(400).json({ error: error });

    // find and delete related address document
    await Address.findByIdAndRemove(restaurant.addressId);
    res.json({
      status: "deleted",
    });
  });
});

/* POST create new restaurant address document */
router.post("/:id/address/create", auth, async (req, res) => {
  // Check user permission
  const permission = await roles.can(req.user.role).createOwn("address");
  if (!permission.granted)
    return res.status(400).json({ error: "Permission denied" });

  // validate address info
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new user address
  const address = new Address(req.body);
  const saved_address = await address.save();
  if (!saved_address) return res.status(400).send("Unable to save address");

  // find authenticated user document
  Restaurant.findById({ _id: req.params.id }, (error, restaurant) => {
    if (error) return res.status(400).json({ error: error });
    if (!restaurant)
      return res
        .status(400)
        .json({ error: "Restaurant does not exist in database" });
    restaurant.addressId = saved_address._id;
    restaurant.save();
  });

  res.status(200).send(saved_address);
});

module.exports = router;
