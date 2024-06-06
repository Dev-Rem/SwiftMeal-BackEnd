const express = require("express");
const Restaurant = require("../models/restaurant.js");
const Address = require("../models/address.js");
const { auth, grantAccess } = require("./authController");
const { roles } = require("../role");
const { restaurantValidation, addressValidation } = require("../validation");
const router = express.Router();

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant document
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               restaurantInfo:
 *                 type: string
 *             example:
 *               name: Larson, Kris and Renner
 *               phoneNumber: 231-308-959-8857
 *               email: Athena_OHara88@yahoo.com
 *               restaurantInfo: Lorem Ipsum
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 restaurantInfo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               _id: 60c6b6b0b553eb003467e7d4
 *               name: Larson, Kris and Renner
 *               phoneNumber: 231-308-959-8857
 *               email: Athena_OHara88@yahoo.com
 *               restaurantInfo: Lorem Ipsum
 *               createdAt: 2021-06-13T17:44:00.335Z
 *               updatedAt: 2021-06-13T17:44:00.335Z
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */

router.post(
  "/",
  auth,
  grantAccess("createAny", "restaurant"),
  async (req, res) => {
    // validate restaurant create data
    const { error } = restaurantValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new restaurant after data validation
    Restaurant.create(req.body, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurant documents
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   email:
 *                     type: string
 *                   restaurantInfo:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *             example:
 *               - _id: 60c6b6b0b553eb003467e7d4
 *                 name: Larson, Kris and Renner
 *                 phoneNumber: 231-308-959-8857
 *                 email: Athena_OHara88@yahoo.com
 *                 restaurantInfo: Lorem Ipsum
 *                 createdAt: 2021-06-13T17:44:00.335Z
 *                 updatedAt: 2021-06-13T17:44:00.335Z
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
router.get(
  "/",
  auth,
  grantAccess("readAny", "restaurant"),
  async (req, res) => {
    Restaurant.find({}).exec((error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a single restaurant document
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the restaurant document to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 restaurantInfo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               _id: 60c6b6b0b553eb003467e7d4
 *               name: Larson, Kris and Renner
 *               phoneNumber: 231-308-959-8857
 *               email: Athena_OHara88@yahoo.com
 *               restaurantInfo: Lorem Ipsum
 *               createdAt: 2021-06-13T17:44:00.335Z
 *               updatedAt: 2021-06-13T17:44:00.335Z
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
/* GET get a single restaurant document with populated address field */
router.get(
  "/:id",
  auth,
  grantAccess("readAny", "restaurant"),
  async (req, res) => {
    // Find restaurant document
    await Restaurant.findById(req.params.id, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json(restaurant);
    });
  }
);
/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Edit a single restaurant document
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the restaurant document to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               restaurantInfo:
 *                 type: string
 *             example:
 *               name: Larson, Kris and Renner
 *               phoneNumber: 231-308-959-8857
 *               email: Athena_OHara88@yahoo.com
 *               restaurantInfo: Lorem Ipsum
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 restaurantInfo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               _id: 60c6b6b0b553eb003467e7d4
 *               name: Larson, Kris and Renner
 *               phoneNumber: 231-308-959-8857
 *               email: Athena_OHara88@yahoo.com
 *               restaurantInfo: Lorem Ipsum
 *               createdAt: 2021-06-13T17:44:00.335Z
 *               updatedAt: 2021-06-13T17:44:00.335Z
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
/* PUT edit a single restaurant document */
router.put(
  "/:id",
  auth,
  grantAccess("updateAny", "restaurant"),
  async (req, res) => {
    // validate restaurant create data
    const { error } = restaurantValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find and update restaurant document
    await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (error, restaurant) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(restaurant);
      }
    );
  }
);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a single restaurant document
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the restaurant document to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *             example:
 *               status: Success
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */
/* DELETE delete a single restaurant document */
router.delete(
  "/:id",
  grantAccess("deleteAny", "restaurant"),
  auth,
  async (req, res) => {
    console.log("i got here");
    // find and delete restaurant document
    Restaurant.findByIdAndRemove(req.params.id, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });

      // find and delete related address document
      // Address.findByIdAndRemove(restaurant.addressId);
      res.status(200).json({ status: "Success" });
    });
  }
);

/**
 * @swagger
 * /api/restaurants/{id}/address/create:
 *   post:
 *     summary: Create a new restaurant address document
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the restaurant to add the address to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               postalCode:
 *                 type: string
 *             example:
 *               street: 123 Main St
 *               city: Springfield
 *               state: IL
 *               country: USA
 *               postalCode: 62701
 *     responses:
 *       '200':
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 postalCode:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *             example:
 *               _id: 60c6b6b0b553eb003467e7d4
 *               street: 123 Main St
 *               city: Springfield
 *               state: IL
 *               country: USA
 *               postalCode: 62701
 *               createdAt: 2021-06-13T17:44:00.335Z
 *               updatedAt: 2021-06-13T17:44:00.335Z
 *       '400':
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               error: "Error message"
 */

/* POST create new restaurant address document */
router.post(
  "/:id/address/create",
  grantAccess("createOwn", "address"),
  auth,
  async (req, res) => {
    // validate address info
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // create new user address
    const address = new Address(req.body);
    const saved_address = await address.save();
    if (!saved_address) return res.status(400).send("Unable to save address");

    Restaurant.findById({ _id: req.params.id }, (error, restaurant) => {
      if (error) return res.status(400).json({ error: error });
      if (!restaurant)
        return res.status(400).json({ error: "Restaurant does not exist" });
      restaurant.addressId = saved_address._id;
      restaurant.save();
    });

    res.status(200).send(saved_address);
  }
);

module.exports = router;
