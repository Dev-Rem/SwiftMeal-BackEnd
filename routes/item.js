const express = require("express");
const Item = require("../models/item.js");
const Cart = require("../models/cart.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { itemValidation } = require("../validation");

/**
 * @swagger
 * /api/cart/{id}/create:
 *   post:
 *     summary: Create an item document and add it to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Food ID to add to the item object
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
 *           example:
 *             discount: 10
 *             quantity: 2
 *     responses:
 *       200:
 *         description: Successfully created item and added to the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *             example:
 *               _id: "12345"
 *               food: "54321"
 *               discount: 10
 *               quantity: 2
 *       400:
 *         description: Bad request or error creating item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Validation error message"
 */
/* 
POST create item document route 
params { id: food id to add to the item object }
*/
router.post(
  "/:id/create",
  auth,
  grantAccess("createOwn", "item"),
  (req, res) => {
    console.log(req.user);
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

        // update user cart
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
/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Get an item document
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *             example:
 *               _id: "12345"
 *               food: "54321"
 *               discount: 10
 *               quantity: 2
 *       400:
 *         description: Bad request or error retrieving item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid item ID"
 */

/* GET get an item document route */
router.get("/:id", grantAccess("readOwn", "item"), (req, res) => {
  // find item by id
  Item.findById(req.params.id, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});

/**
 * @swagger
 * /api/item/{id}/edit:
 *   put:
 *     summary: Edit an item document
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               food:
 *                 type: string
 *                 description: Food ID
 *               discount:
 *                 type: number
 *                 description: Discount on the item
 *               quantity:
 *                 type: number
 *                 description: Quantity of the item
 *           example:
 *             food: "54321"
 *             discount: 15
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Successfully edited item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Item ID
 *                 food:
 *                   type: string
 *                   description: Food ID
 *                 discount:
 *                   type: number
 *                   description: Discount on the item
 *                 quantity:
 *                   type: number
 *                   description: Quantity of the item
 *             example:
 *               _id: "12345"
 *               food: "54321"
 *               discount: 15
 *               quantity: 3
 *       400:
 *         description: Bad request or error editing item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid item ID"
 */
/* PUT edit item document route */
router.put("/:id/edit", auth, grantAccess("updateOwn", "item"), (req, res) => {
  Item.findByIdAndUpdate(req.params.id, { $set: req.body }, (error, item) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(item);
  });
});
/**
 * @swagger
 * /api/item/{id}/delete:
 *   delete:
 *     summary: Delete an item document
 *     tags: [Item]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID to delete
 *     responses:
 *       200:
 *         description: Successfully deleted item
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
 *         description: Bad request or error deleting item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid item ID"
 */
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

module.exports = router;
