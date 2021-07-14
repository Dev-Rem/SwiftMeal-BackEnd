const express = require("express");
const Cart = require("../models/cart.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");

/* POST add item to cart route */
router.put(
  "/:id/add",
  auth,
  grantAccess("updateOwn", "cart"),
    (req, res) => {
      Cart.findOneAndUpdate({userId: req.user._id}, { $set: req.body})
  }
);
