const express = require("express");
const Cart = require("../models/cart.js");
const Item = require("../models/item.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { itemValidation } = require("../validation");

/* POST add item to cart route 
params { id: food id to add to the item object }*/
router.post(
  "/:id/item/add",
  auth,
  grantAccess("createOwn", "item"),
  (req, res) => {
    // Validate address data
    const { error } = itemValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new item document
    Item.create(
      {
        food: req.params.id,
        discount: req.body.discount,
        quantity: req.body.quantity,
      },
      (error, item) => {
        if (error) return res.status(400).json({ error: error });

        // update user cart
        Cart.findOneAndUpdate(
          { accountId: req.user._id },
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

/* GET get an item document route 
params { id: item id of id document to find }*/
router.get("/item/:id", grantAccess("readOwn", "item"), (req, res) => {
  // find item by id
  Item.findById(req.params.id, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});

/* PUT edit item document route */
router.put(
  "/:id/item/edit",
  auth,
  grantAccess("updateOwn", "item"),
  (req, res) => {
    Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (error, item) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(item);
      }
    );
  }
);

/* DELETE delete item document route */
router.delete(
  "/:id/item/delete",
  auth,
  grantAccess("deleteOwn", "item"),
  (req, res) => {
    // find item document by id and delete
    Item.findByIdAndDelete(req.params.id, (error, item) => {
      if (error) return res.status(400).json({ error: error });

      // update user cart
      Cart.findOneAndUpdate(
        { accountId: req.user._id },
        { $pull: { items: item._id } },
        (error) => {
          if (error) return res.status(400).json({ error: error });
        }
      );
      res.status(200).json({ status: "item deleted" });
    });
  }
);

/* GET get all user cart items */
router.get("/", auth, grantAccess("readOwn", "cart"), (req, res) => {
  Cart.findOne({ accountId: req.user._id }, "items")
    .populate({
      path: "items",
      populate: {
        path: "food",
        model: "Food",
      },
    })
    .exec((error, cart) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(cart);
    });
});

module.exports = router;
