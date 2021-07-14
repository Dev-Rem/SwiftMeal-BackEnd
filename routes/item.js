const express = require("express");
const Item = require("../models/item.js");
const Cart = require("../models/cart.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { itemValidation } = require("../validation");

/* POST create item document route */
router.post(
  "/:foodId/create",
  auth,
  grantAccess("createOwn", "item"),
  (req, res) => {
      console.log(req.user)
    // Validate address data
    const { error } = itemValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new item document
    Item.create(
      {
        food: req.params.foodId,
        discount: req.body.discount,
        quantity: req.body.quantity,
      },
      (error, item) => {
        if (error) return res.status(400).json({ error: error });
        Cart.findOneAndUpdate(
          { userId: req.user._id },
          { $push: { items: item._id } },
          (error) => {
            if (error) return res.status(400).json({ error: error });
          }
        );
        res.status(200).json(item);
      }
    );
  }
);

/* GET get an item document route */
router.get("/:id", grantAccess("readOwn", "item"), (req, res) => {
  // find item by id
  Item.findById(req.params.id, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});

/* PUT edit item document route */
router.put("/:id/edit", auth, grantAccess("updateOwn", "item"), (req, res) => {
  Item.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});

/* DELETE delete item document route */
router.delete(
  "/:id/delete",
  auth,
  grantAccess("deleteOwn", "item"),
  (req, res) => {
    // find item document by id and delete
    Item.findByIdAndDelete(req.params.id, (error, item) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "address deleted" });
    });
  }
);

/* GET get all items in user cart */
router.get("/cart", auth, grantAccess("readOwn", "cart"), (req, res) => {
  Cart.findOne({ userId: req.user._id })
    .populate("items")
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(cart);
    });
});

module.exports = router;
