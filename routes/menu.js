const express = require("express");
const Menu = require("../models/menu");
const { auth, grantAccess } = require("./authController");
const { menuValidation } = require("../validation");
const router = express.Router();

/**
 * @swagger
 * /api/menu/{id}/:
 *   post:
 *     summary: Create new restaurant menu
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the menu
 *                 example: "Lunch Specials"
 *               description:
 *                 type: string
 *                 description: Description of the menu
 *                 example: "Special lunch menu with discounted prices"
 *     responses:
 *       200:
 *         description: Successfully created menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *               example:
 *                 restaurantId: "609e12584a72c849b8d887d5"
 *                 name: "Lunch Specials"
 *                 description: "Special lunch menu with discounted prices"
 *                 _id: "609e12604a72c849b8d887d6"
 *                 createdAt: "2024-06-06T13:16:50.921Z"
 *                 updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Bad request or error creating menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid request data"
 */
/* Create new restaurant menu */
// the id passed should be the restuarant id
router.post(
  "/:id/",
  auth,
  grantAccess("createAny", "menu"),
  async (req, res) => {
    // Validate request data
    const { error } = menuValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create new restaurant menu
    Menu.create(
      {
        restaurantId: req.params.id,
        name: req.body.name,
        description: req.body.description,
      },
      (error, menu) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(menu);
      }
    );
  }
);
/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get all restaurant menus
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Successfully retrieved menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   restaurantId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                 example:
 *                   - restaurantId: "609e12584a72c849b8d887d5"
 *                     name: "Lunch Specials"
 *                     description: "Special lunch menu with discounted prices"
 *                     _id: "609e12604a72c849b8d887d6"
 *                     createdAt: "2024-06-06T13:16:50.921Z"
 *                     updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Bad request or error retrieving menus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *             example:
 *               error: "Invalid restaurant ID"
 */
/* Get all restaurant menus */
// the id passed should be the restuarant id
router.get("/:id", async (req, res) => {
  await Menu.find({ restaurantId: req.params.id }, (error, menus) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menus);
  });
});

/**
 * @swagger
 * /api/menu/menu/{id}:
 *   get:
 *     summary: Get a single menu document
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Menu ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               restaurantId: "609e12584a72c849b8d887d5"
 *               name: "Lunch Specials"
 *               description: "Special lunch menu with discounted prices"
 *               _id: "609e12604a72c849b8d887d6"
 *               createdAt: "2024-06-06T13:16:50.921Z"
 *               updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Bad request or error retrieving the menu
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

/* Get a single menu document */
// the id passed should be the menu id
router.get("/menu/:id/", async (req, res) => {
  await Menu.findById(req.params.id, (error, menu) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(menu);
  });
});

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a restaurant menu
 *     tags: [Menu]
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
 *               description:
 *                 type: string
 *             example:
 *               name: "Updated Menu"
 *               description: "New description for the menu"
 *     responses:
 *       200:
 *         description: Successfully updated the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurantId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 _id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               restaurantId: "609e12584a72c849b8d887d5"
 *               name: "Updated Menu"
 *               description: "New description for the menu"
 *               _id: "609e12604a72c849b8d887d6"
 *               createdAt: "2024-06-06T13:16:50.921Z"
 *               updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Bad request or error updating the menu
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
/* Update the a restarant menu */
// the id passed should be the menu id
router.put("/:id", auth, grantAccess("updateAny", "menu"), async (req, res) => {
  // Validate request data
  const { error } = menuValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update menu document
  await Menu.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, menu) => {
      if (error) return res.status(400).json({ error: error });
      menu.save();
      res.status(200).json(menu);
    }
  );
});

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a restaurant menu
 *     tags: [Menu]
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
 *     responses:
 *       200:
 *         description: Successfully deleted the menu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Success message
 *             example:
 *               status: "Success"
 *       400:
 *         description: Bad request or error deleting the menu
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

/* Delete a restaurant menu */
// the id passed should be the menu id
router.delete("/:id", auth, grantAccess("deleteAny", "menu"), (req, res) => {
  //  delete menu document
  Menu.findByIdAndRemove(req.params.id, async (error) => {
    if (error) return res.status(400).json({ error: error });

    res.status(200).json({
      status: "Success",
    });
  });
});

module.exports = router;
