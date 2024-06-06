const express = require("express");
const Address = require("../models/address.js");
const router = express.Router();
const { auth, grantAccess } = require("./authController");
const { addressValidation } = require("../validation");

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all address documents
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all address documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Address ID
 *                   accountId:
 *                     type: string
 *                     description: User account ID
 *                   streetNumber:
 *                     type: string
 *                     description: Street number
 *                   streetName:
 *                     type: string
 *                     description: Street name
 *                   city:
 *                     type: string
 *                     description: City
 *                   postalCode:
 *                     type: string
 *                     description: Postal code
 *                   country:
 *                     type: string
 *                     description: Country
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Address creation timestamp
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Address update timestamp
 *             example:
 *               - _id: "6661b6c289bc1c5d21ca0e6b"
 *                 accountId: "6661af9fd7c00c8694ea7f6a"
 *                 streetNumber: "56-60"
 *                 streetName: "Terez Korut"
 *                 city: "Budapest"
 *                 postalCode: "1062"
 *                 country: "Hungary"
 *                 createdAt: "2024-06-06T13:16:50.921Z"
 *                 updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Error retrieving address documents
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
/* GET get all address documents */
router.get("/", auth, grantAccess("readOwn", "address"), async (req, res) => {
  // Find all address documents
  Address.find({ accountId: req.user._id }, (error, addresses) => {
    if (error) return res.status(400).json({ error: error });
    res.status(200).json(addresses);
  });
});

/**
 * @swagger
 * /api/addresses/create:
 *   post:
 *     summary: Create a new address document
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               streetNumber:
 *                 type: string
 *                 description: Street number
 *               streetName:
 *                 type: string
 *                 description: Street name
 *               city:
 *                 type: string
 *                 description: City
 *               postalCode:
 *                 type: string
 *                 description: Postal code
 *               country:
 *                 type: string
 *                 description: Country
 *           example:
 *             streetNumber: "56-60"
 *             streetName: "Terez Korut"
 *             city: "Budapest"
 *             postalCode: 1062
 *             country: "Hungary"
 *     responses:
 *       200:
 *         description: Successfully created a new address document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Address ID
 *                 accountId:
 *                   type: string
 *                   description: User account ID
 *                 streetNumber:
 *                   type: string
 *                   description: Street number
 *                 streetName:
 *                   type: string
 *                   description: Street name
 *                 city:
 *                   type: string
 *                   description: City
 *                 postalCode:
 *                   type: string
 *                   description: Postal code
 *                 country:
 *                   type: string
 *                   description: Country
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Address creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Address update timestamp
 *             example:
 *               _id: "6661b6c289bc1c5d21ca0e6b"
 *               accountId: "6661af9fd7c00c8694ea7f6a"
 *               streetNumber: "56-60"
 *               streetName: "Terez Korut"
 *               city: "Budapest"
 *               postalCode: 1062
 *               country: "Hungary"
 *               createdAt: "2024-06-06T13:16:50.921Z"
 *               updatedAt: "2024-06-06T13:16:50.921Z"
 *       400:
 *         description: Error creating address document
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
/* POST create a new address document */
router.post(
  "/create",
  auth,
  grantAccess("createOwn", "address"),
  async (req, res) => {
    // Validate address data
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // Create new address document
    Address.create(
      {
        accountId: req.user._id,
        streetNumber: req.body.streetNumber,
        streetName: req.body.streetName,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
      },
      async (error, address) => {
        if (error) return res.status(400).json({ error: error });
        await address.save();
        res.status(200).json(address);
      }
    );
  }
);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Edit a single address document
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               streetNumber:
 *                 type: string
 *                 description: Street number
 *               streetName:
 *                 type: string
 *                 description: Street name
 *               city:
 *                 type: string
 *                 description: City
 *               postalCode:
 *                 type: string
 *                 description: Postal code
 *               country:
 *                 type: string
 *                 description: Country
 *           example:
 *             streetNumber: "5b"
 *             streetName: "szigeti ut"
 *             city: "Pécs"
 *             postalCode: 7624
 *             country: "Hungary"
 *     responses:
 *       200:
 *         description: Successfully edited the address document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Address ID
 *                 accountId:
 *                   type: string
 *                   description: User account ID
 *                 streetNumber:
 *                   type: string
 *                   description: Street number
 *                 streetName:
 *                   type: string
 *                   description: Street name
 *                 city:
 *                   type: string
 *                   description: City
 *                 postalCode:
 *                   type: string
 *                   description: Postal code
 *                 country:
 *                   type: string
 *                   description: Country
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Address creation timestamp
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Address update timestamp
 *             example:
 *               _id: "6661b6c289bc1c5d21ca0e6b"
 *               accountId: "6661af9fd7c00c8694ea7f6a"
 *               streetNumber: "5b"
 *               streetName: "szigeti ut"
 *               city: "Pécs"
 *               postalCode: 7624
 *               country: "Hungary"
 *               createdAt: "2024-06-06T13:16:50.921Z"
 *               updatedAt: "2024-06-06T14:00:50.921Z"
 *       400:
 *         description: Error editing address document
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
/* PUT edit a single address document */
router.put(
  "/:id",
  auth,
  grantAccess("updateOwn", "address"),
  async (req, res) => {
    // Validate address data
    const { error } = addressValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Find and update address by id
    Address.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
      (error, address) => {
        if (error) return res.status(400).json({ error: error });
        res.status(200).json(address);
      }
    );
  }
);
/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address document
 *     tags: [Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Successfully deleted the address document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Deletion status message
 *             example:
 *               status: "address deleted"
 *       400:
 *         description: Error deleting address document
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
/* DELETE delete an address document */
router.delete(
  "/:id",
  auth,
  grantAccess("deleteOwn", "address"),
  async (req, res) => {
    // Find and delete address by id
    Address.findByIdAndRemove(req.params.id, (error) => {
      if (error) return res.status(400).json({ error: error });
      res.status(200).json({ status: "address deleted" });
    });
  }
);

module.exports = router;
