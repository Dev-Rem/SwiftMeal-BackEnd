const express = require("express");
const Cart = require("../models/cart.js");
const Item = require("../models/item.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { itemValidation } = require("../validation");

/**
 * @swagger
 * /api/cart/{id}/item/add:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The food ID to add to the item object
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *                 description: Discount on the item
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item
 *             example:
 *               discount: 10
 *               quantity: 2
 *     responses:
 *       200:
 *         description: Item successfully added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 createdAt:
 *                   type: string
 *                   description: Item creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   description: Item update timestamp
 *             example:
 *               food: "60b6a2f5d3c4b9128c123456"
 *               discount: 10
 *               quantity: 2
 *               _id: "60b6a3f2d3c4b9128c123457"
 *               createdAt: "2024-06-06T13:20:15.123Z"
 *               updatedAt: "2024-06-06T13:20:15.123Z"
 *       400:
 *         description: Bad request or error adding item to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Some error message"
 */
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

/**
 * @swagger
 * /api/cart/item/{id}:
 *   get:
 *     summary: Get an item document
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID of the item document to find
 *     responses:
 *       200:
 *         description: Item found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 createdAt:
 *                   type: string
 *                   description: Item creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   description: Item update timestamp
 *             example:
 *               food: "60b6a2f5d3c4b9128c123456"
 *               discount: 10
 *               quantity: 2
 *               _id: "60b6a3f2d3c4b9128c123457"
 *               createdAt: "2024-06-06T13:20:15.123Z"
 *               updatedAt: "2024-06-06T13:20:15.123Z"
 *       400:
 *         description: Bad request or error finding the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Some error message"
 */

/* GET get an item document route 
params { id: item id of id document to find }*/
router.get("/item/:id", grantAccess("readOwn", "item"), (req, res) => {
  // find item by id
  Item.findById(req.params.id, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});

/**
 * @swagger
 * /api/cart/{id}/item/edit:
 *   put:
 *     summary: Edit an item document
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID of the item document to edit
 *       - in: body
 *         name: item
 *         description: Item object that needs to be updated
 *         schema:
 *           type: object
 *           properties:
 *             food:
 *               type: string
 *               description: Food ID
 *             discount:
 *               type: number
 *               description: Discount on the item
 *             quantity:
 *               type: number
 *               description: Quantity of the item
 *           required:
 *             - food
 *             - discount
 *             - quantity
 *           example:
 *             food: "60b6a2f5d3c4b9128c123456"
 *             discount: 15
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 createdAt:
 *                   type: string
 *                   description: Item creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   description: Item update timestamp
 *             example:
 *               food: "60b6a2f5d3c4b9128c123456"
 *               discount: 15
 *               quantity: 3
 *               _id: "60b6a3f2d3c4b9128c123457"
 *               createdAt: "2024-06-06T13:20:15.123Z"
 *               updatedAt: "2024-06-06T13:25:15.123Z"
 *       400:
 *         description: Bad request or error updating the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Some error message"
 */
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

/**
 * @swagger
 * /api/cart/{id}/item/delete:
 *   delete:
 *     summary: Delete an item document
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID of the item document to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Deletion status
 *             example:
 *               status: "item deleted"
 *       400:
 *         description: Bad request or error deleting the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Some error message"
 */
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
/**
 * @swagger
 * /api/cart/:
 *   get:
 *     summary: Get all user cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Item ID
 *                       food:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Food ID
 *                           name:
 *                             type: string
 *                             description: Food name
 *                           price:
 *                             type: number
 *                             description: Food price
 *                       discount:
 *                         type: number
 *                         description: Discount on the item
 *                       quantity:
 *                         type: number
 *                         description: Quantity of the item
 *             example:
 *               items: [
 *                 {
 *                   _id: "12345",
 *                   food: {
 *                     _id: "54321",
 *                     name: "Pizza",
 *                     price: 12.99
 *                   },
 *                   discount: 0,
 *                   quantity: 2
 *                 }
 *               ]
 *       400:
 *         description: Bad request or error retrieving cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Some error message"
 */

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
