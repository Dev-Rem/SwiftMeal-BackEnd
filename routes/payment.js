require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const Cart = require("../models/cart");
const stripe = require("stripe")(
  "sk_test_51JEYabJhEC7GTHfBNElZoZSffEsMXY6NEKsLlV6zzH00zXSiYGgolHRoX5MjulkJkDn9YjYwVGNQvj6wxfWzgMXG00VXnvl2Hc"
);

router.get("/checkout", auth, (req, res) => {
  res.render("checkout");
});
router.post("/", auth, grantAccess("createOwn", "payment"), (req, res) => {
  Cart.findOne({ accountId: req.user._id }, "items")
    .populate({
      path: "items",
      populate: {
        path: "food",
        model: "Food",
      },
    })
    .exec(async (error, cart) => {
      if (error) return res.status(400).json({ error: error });
      let total = 0;
      cart.items.forEach((item) => (total += item.food.price * item.quantity));
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });

      res.send({ clientSecret: paymentIntent.client_secret });
    });
});

module.exports = router;
