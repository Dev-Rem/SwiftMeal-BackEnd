require("dotenv").config();
const express = require("express");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const Cart = require("../models/cart");
const stripe = require("stripe")(
  "sk_test_51JEYabJhEC7GTHfBNElZoZSffEsMXY6NEKsLlV6zzH00zXSiYGgolHRoX5MjulkJkDn9YjYwVGNQvj6wxfWzgMXG00VXnvl2Hc"
);

/**
 * @swagger
 * /api/payments/checkout:
 *   get:
 *     summary: Render checkout page
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Rendered checkout page
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */

router.get("/checkout", auth, (req, res) => {
  res.render("checkout");
});
/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientSecret:
 *                   type: string
 *             example:
 *               clientSecret: "some_client_secret"
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */

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

/**
 * @swagger
 * /api/payments/index:
 *   get:
 *     summary: Render index page
 *     tags: [Payments]
 *     responses:
 *       '200':
 *         description: Rendered index page
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */

router.get("/index", (req, res) => {
  res.render("index");
});

module.exports = router;
