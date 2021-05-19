const express = require("express");
const Address = require("../models/address.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { addressValidation } = require("../validation");

/* GET get all address documents */
router.get("/", auth, grantAccess("readAny", "address"), async (req, res) => {
  // Find all address documents
  Address.find((error, address) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(address);
  });
});

/* POST create a new address document */
router.post(
  "/create",
  auth,
  grantAccess("createOwn", "address"),
  async (req, res) => {
    // Validate address data
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Create new address document
    Address.create(req.body, async (error, address) => {
      if (error) return res.status(400).json({ error: error });
      await address.save();
      res.status(200).json(account);
    });
  }
);

/* GET get a single address document */
router.get(
  "/:id",
  auth,
  grantAccess("readOwn", "address"),
  async (req, res) => {
    // Find address by id
    Address.findById(req.params.id, (error, address) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(address);
    });
  }
);

/* PUT edit a single address document */
router.put(
  "/:id",
  auth,
  grantAccess("updateOwn", "address"),
  async (req, res) => {
    // Validate address data
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find and update address by id
    Address.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (error, address) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(address);
      }
    );
  }
);

/* DELETE delete an address document */
router.delete(
  "/:id",
  auth,
  grantAccess("deleteOwn", "address"),
  async (req, res) => {
    // Find and delete address by id
    Address.findByIdAndRemove(req.params.id, (error) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "address deleted" });
    });
  }
);

module.exports = router;
