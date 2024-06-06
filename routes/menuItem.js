require("dotenv").config();
const express = require("express");
const MenuItem = require("../models/menuItem");
const { auth, grantAccess } = require("./authController");
const { menuItemValidation } = require("../validation");
const router = express.Router();

/**
 * @swagger
 * /api/menu-items/{id}:
 *   post:
 *     summary: Create a new food document
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Menu ID
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the food
 *               price:
 *                 type: number
 *                 description: Price of the food
 *               description:
 *                 type: string
 *                 description: Description of the food
 *     responses:
 *       200:
 *         description: Successfully created a new food document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the created food document
 *                 menuId:
 *                   type: string
 *                   description: ID of the menu associated with the food
 *                 name:
 *                   type: string
 *                   description: Name of the food
 *                 price:
 *                   type: number
 *                   description: Price of the food
 *                 description:
 *                   type: string
 *                   description: Description of the food
 *                 createdAt:
 *                   type: string
 *                   description: Timestamp of creation
 *                 updatedAt:
 *                   type: string
 *                   description: Timestamp of last update
 *             example:
 *               _id: "6123456789abcdef01234567"
 *               menuId: "6123456789abcdef01234567"
 *               name: "Hamburger"
 *               price: 9.99
 *               description: "Delicious hamburger with cheese and fries"
 *               createdAt: "2024-06-07T12:00:00.000Z"
 *               updatedAt: "2024-06-07T12:00:00.000Z"
 *       400:
 *         description: Bad request or error creating the food document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid menu ID"
 */
router.post(
  "/:id",
  auth,
  grantAccess("createAny", "menuItem"),
  async (req, res) => {
    // Validate request data
    const { error } = menuItemValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //   create new food document
    MenuItem.create(
      {
        menuId: req.params.id,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
      },
      (error, menuItem) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(menuItem);
      }
    );
  }
);

/**
 * @swagger
 * /api/menu-items/{id}:
 *   get:
 *     summary: Get all the menu items in a menu
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Successfully retrieved all menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the menu item
 *                   menuId:
 *                     type: string
 *                     description: ID of the menu associated with the menu item
 *                   name:
 *                     type: string
 *                     description: Name of the menu item
 *                   price:
 *                     type: number
 *                     description: Price of the menu item
 *                   description:
 *                     type: string
 *                     description: Description of the menu item
 *                   createdAt:
 *                     type: string
 *                     description: Timestamp of creation
 *                   updatedAt:
 *                     type: string
 *                     description: Timestamp of last update
 *             example:
 *               - _id: "6123456789abcdef01234567"
 *                 menuId: "6123456789abcdef01234567"
 *                 name: "Hamburger"
 *                 price: 9.99
 *                 description: "Delicious hamburger with cheese and fries"
 *                 createdAt: "2024-06-07T12:00:00.000Z"
 *                 updatedAt: "2024-06-07T12:00:00.000Z"
 *               - _id: "6123456789abcdef01234568"
 *                 menuId: "6123456789abcdef01234567"
 *                 name: "Pizza"
 *                 price: 12.99
 *                 description: "Tasty pizza with pepperoni and mushrooms"
 *                 createdAt: "2024-06-07T12:01:00.000Z"
 *                 updatedAt: "2024-06-07T12:01:00.000Z"
 *       400:
 *         description: Bad request or error retrieving menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid menu ID"
 */
router.get("/:id", async (req, res) => {
  await MenuItem.find({ menuId: req.params.id }, (error, menuItems) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menuItems);
  });
});

/**
 * @swagger
 * /api/menu-items/{id}/item:
 *   get:
 *     summary: Retrieve a single menu item document
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu item to retrieve
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
router.get("/:id/item", (req, res) => {
  MenuItem.findById(req.params.id, (error, menuItem) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menuItem);
  });
});

/**
 * @swagger
 * /api/menu-items/{id}:
 *   put:
 *     summary: Update a single menu item document
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu item to update
 *       - in: body
 *         name: body
 *         required: true
 *         description: The updated information for the menu item
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 *             description:
 *               type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
/* PUT update a single menu item document */
// the id provided should be the menu item id
router.put("/:id", auth, grantAccess("updateAny", "menuItem"), (req, res) => {
  // Validate request data
  const { error } = menuItemValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //   find document by id and update
  MenuItem.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
    },
    { new: true },
    (error, menuItem) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(menuItem);
    }
  );
});

/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Delete a single food document
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the menu item to delete
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: Success
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
// DELETE delete a single food document
// the id provided should be the menu item id
router.delete(
  "/:id",
  auth,
  grantAccess("deleteAny", "menuItem"),
  (req, res) => {
    MenuItem.findByIdAndRemove(req.params.id, (error, menuItem) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "Success" });
    });
  }
);

module.exports = router;
