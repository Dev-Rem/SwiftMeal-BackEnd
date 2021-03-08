const express = require("express");
const Address = require("../models/address.js");
const router = express.Router();
const { auth } = require("./authController");
const { roles } = require("../role");
const { addressValidation } = require("../validation");

/* GET get all address documents */
router.get("/", auth, async (req, res) => {
  //  check user permission to view addresses
  const permission = await roles.can(req.user.role).readAny("address");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });

  // Find all address documents
  Address.find((error, address) => {
    if (error) return handleError(error);
    res.send(address);
  });
});

/* POST crete a new address document */
router.post("/create", auth, async (req, res) => {
  //  check user permission to create addresses
  const permission = await roles.can(req.user.role).createOwn("address");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });

  // Validate address data
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Create new address document
  Address.create(req.body, async (error, address) => {
    if (error) return res.status(400).json({ error: error });
    await address.save();
    res.json(account);
  });
});

/* GET get a single address document */
router.get("/:id", auth, async (req, res) => {
  //  check user permission to view address
  const permission = await roles.can(req.user.role).readOwn("address");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });

  // Find address by id
  Address.findById(req.params.id, (error, address) => {
    if (error) return res.status(400).json({ error: error });
    res.send(address);
  });
});

/* PUT edit a single address document */
router.put("/:id", auth, async (req, res) => {
  //  check user permission to edit address
  const permission = await roles.can(req.user.role).updateOwn("address");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });

  // Validate address data
  const { error } = addressValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find and update address by id
  Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, address) => {
      if (error) return res.status(400).json({ error: error });
      res.send(address);
    }
  );
});

/* DELETE delete an address document */
router.delete("/:id", auth, async (req, res) => {
  //  check user permission to delete address
  const permission = await roles.can(req.user.role).deleteOwn("address");
  if (!permission.granted)
    return res
      .status(400)
      .json({ error: "Permission denied you can not access this resource" });
  // Find and delete address by id
  Address.findByIdAndRemove(req.params.id, (error, address) => {
    if (error) return res.status(400).json({ error: error });
    res.send({ status: "address deleted" });
  });
});

module.exports = router;
