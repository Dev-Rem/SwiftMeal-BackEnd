const express = require("express");
const Address = require("../models/address.js");
const router = express.Router();
const auth = require("./authController");

/* POST create new address */
router.post("/", auth, (req, res) => {
  Address.create(req.body, (error, address) => {
    if (error) return handleError(error);
    res.send(address);
  });
});

/* GET get all address documents */
router.get("/", (req, res) => {
  Address.find((error, address) => {
    if (error) return handleError(error);
    res.send(address);
  });
});

/* GET get a single address document */
router.get("/:id", auth, (req, res) => {
  Address.findById(req.params.id, (error, address) => {
    if (error) return handleError(error);
    res.send(address);
  });
});

/* PUT edit a single address document */
router.put("/:id", auth, (req, res) => {
  Address.findByIdAndUpdate(req.params.id, req.body).exec((error, address) => {
    if (error) return handleError(error);
    res.send(address);
  });
});

/* DELETE delete an address document */
router.delete("/:id", auth, (req, res) => {
  Address.findByIdAndRemove(req.params.id, (error, address) => {
    if (error) return handleError(error);
    res.send({ status: "address deleted", address_id: address._id });
  });
});

module.exports = router;
