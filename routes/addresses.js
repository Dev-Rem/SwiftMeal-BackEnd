const express = require("express");
const Address = require("../models/address.js");
const Account = require("../models/account.js");
const router = express.Router();
const auth = require("./authController");
const { addressValidation } = require("../validation");

/* POST create new user address */
router.post("/user", auth, async (req, res) => {
  // validate address info
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // create new user address
  const address = new Address(req.body);
  await address.save((error, address) => {
    if (error) return res.status(400).send("Unable to save address");
    
    // find authenticated user document
    const account = await Account.findByIdAndUpdate({ _id: req.user._id }, { address_id: address._id });
    if (!account) return res.status(400).send("Could not update account");
    account.save();
    res.status(200).send(address);
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
